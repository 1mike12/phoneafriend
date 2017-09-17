const bookshelf = require("../DB").bookshelf;
let knex = require("../DB").knex;

const Promise = require("bluebird");
let _ = require("lodash");

const instanceMembers = {
    hasTimestamps: true,
    soft: ['deleted_at']
};

const staticMembers = {
    //this refers to whatever class is extending

    getCollection: function(){
        return bookshelf.Collection.extend({
            model: this
        })
    },

    forgeCollection: function(json){
        const Collection = bookshelf.Collection.extend({
            model: this
        });
        if (json) {
            return Collection.forge(json)
        }
        return Collection.forge();
    },

    /**
     * Does a fake upsert by searching for extant models that match a given externalId. Those that exist already will be updated, with their internal 'id' attached, to trigger update.
     * Models that do not exist will be regularly inserted
     *
     * @param collection
     * @param externalIdName the name of the column where external ids are compared against
     * @param {function} filterQuery, function of type function(query){}
     * @returns {*|Promise<U>|Promise.<TResult>}
     */
    upsert: function(collection, externalIdName, filterQuery){

        const Class = this;

        const externalIds = collection.pluck(externalIdName);
        return this.where(externalIdName, "in", externalIds).query(filterQuery)
        .fetchAll({columns: ["id", externalIdName]})
        .then(function(extants){

            const toUpdate = Class.forgeCollection();
            const toInsert = collection;

            extants.forEach(function(extant){
                const id = extant.get("id");
                const externalId = extant.get(externalIdName);

                const filter = {};
                filter[externalIdName] = externalId;
                const matched = collection.where(filter);

                if (matched.length !== 1) {
                    throw new Error("Ambiguous upsert, non unique external id, more than one matched in upsert")
                }
                const updatable = matched[0]; //array
                toInsert.remove(updatable);
                updatable.set("id", id);
                toUpdate.add(updatable);
            });

            return Promise.join(
                toUpdate.invokeThen("save"),
                toInsert.invokeThen("save")
            )
        })
    },

    deDupeSave: function(newCollection, externalIdName, filterQuery){

        const Class = this;
        const externalIds = newCollection.pluck(externalIdName);
        return this.where(externalIdName, "in", externalIds).query(filterQuery)
        .fetchAll({columns: ["id", externalIdName]})
        .then(function(extantCollection){
            let newItems = Class.deDupe(newCollection, extantCollection, externalIdName);
            return newItems.invokeThen("save");
        })
    },

    deDupe: function(newCollection, extantCollection, externalId){
        if (!externalId) throw new Error("need externalId");

        let existingIds = new Set();
        extantCollection.forEach(extant => existingIds.add(extant.get(externalId)));
        let dedupedCollection = this.forgeCollection();
        newCollection.forEach(item =>{
            if (!existingIds.has(item.get(externalId))) {
                dedupedCollection.add(item)
            }
        });
        return dedupedCollection;
    }
};

module.exports = bookshelf.Model.extend(instanceMembers, staticMembers);