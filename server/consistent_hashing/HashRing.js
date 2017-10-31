const xxhash = require("xxhashjs").h32;
const uuid = require("uuid/v1");

const SEED = 0;
const MAX_32_BIT_INT = 4294967295;
const CLONED_LOCATIONS_PER_SERVER = 15;

class Server {
    constructor(serverId){
        this.id = serverId;
        this.keyValue = new Map();
    }

    set(key, value){
        this.keyValue.set(key, value)
    }

    get(key){
        return this.keyValue.get(key)
    }
}

class DistributedMap {

    constructor(){
        this.location_Server = new Map();
        this.serverId_Server = new Map();
    }

    addServer(server){
        let locations = DistributedMap.getLocations(server.id)
        locations.forEach(location =>{
            this.location_Server.set(location, server)
        });
        this.location_Server = new Map([...this.location_Server.entries()].sort());
        this.serverId_Server.set(server.id, server);
    }

    getServers(){
        return Array.from(this.serverId_Server.values())
    }

    removeServer(server){
        //distribute key value pairs
        let locations = DistributedMap.getLocations(server.id)
        locations.forEach(location =>{
            this.location_Server.delete(location)
        });
        this.serverId_Server.delete(server.id)

        for (let entry of server.keyValue.entries()) {
            let [key, value] = entry;
            this.set(key, value);
        }
    }

    static getLocations(serverId){
        let locations = [];
        for (let i = 0; i < CLONED_LOCATIONS_PER_SERVER; i++) {
            let location = DistributedMap.getLocationForKey(serverId + "random word" + i);
            locations.push(location)
        }
        return locations;
    }

    set(key, value){
        try {
            let server = this.getServerForKey(key)
            server.set(key, value);
        } catch (e) {
            let x = e;
        }

    }

    get(key){
        let server = this.getServerForKey(key)
        return server.get(key)
    }

    getServerForKey(key){
        let locations = Array.from(this.location_Server.keys())
        let keyLocation = DistributedMap.getLocationForKey(key + "");
        let location = DistributedMap.getLocationForArray(keyLocation, locations)
        return this.location_Server.get(location);
    }

    static getLocationForKey(key){
        return xxhash(key, SEED).toNumber() / MAX_32_BIT_INT;
    }

    /**
     * get smallest location larger than x
     * @param x
     * @param locations
     */
    static getLocationForArray(x, locations){
        //wrap around if x is larger than largest location
        let lastLocation = locations[locations.length - 1]
        if (x > lastLocation) return locations[0];
        //change to log n search
        for (let i = 0; i < locations.length; i++) {
            let currentLocation = locations[i];
            if (x <= currentLocation){
                return currentLocation;
            }
        }
    }

}

let ring = new DistributedMap();
let servers = [];
for (let i = 0; i < 12; i++) {
    servers.push(new Server(i))
}

servers.forEach(server => ring.addServer(server));
for (let i = 0; i < 1000; i++) {
    ring.set(i, uuid())
}

let totals = ring.getServers().map(server => server.keyValue.size);
let [keyStoredOnServerOne, valueStoredOnServerOne] = servers[1].keyValue.entries().next().value
ring.removeServer(servers[0])
let value = ring.get(keyStoredOnServerOne);