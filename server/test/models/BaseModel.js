/**
 * Created by 1mike12 on 6/18/2017.
 */
const BaseModel = require("../../models/BaseModel");

describe("BaseModel", function(){

    it("dedupe", done =>{
        let extant = BaseModel.forgeCollection([
            {
                name: "mozart"
            },
            {
                name: "bach"
            },
            {
                name: "beethoven"
            }
        ]);

        let newCollection = BaseModel.forgeCollection([
            {
                name: "beethoven"
            },
            {
                name: "schubert"
            }
        ]);

        let deduped = BaseModel.deDupe(newCollection, extant, "name");

        expect(deduped.length).to.eql(1);
        let newItem = deduped.at(0);
        expect(newItem.get("name")).eql("schubert");
        done();
    })
});

