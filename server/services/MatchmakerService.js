const Promise = require("bluebird");
const DeclinedSession = require("../models/DeclinedSession");
const knex = require("../DB").knex;
const User = require("../models/User");

class MatchMakerService {

    static findMatchForSession(session, attempts = 0){
        //while session not active
        //send match for following users=>

        if (attempts >= 5){
            console.log("fail");
        } else {
            MatchMakerService.getMatchedUsersForSession(session)
            .then(users =>{
                if (users === null){
                    console.log("fail")
                }

                let promises = [];
                users.forEach(user => promises.push(user.alertSessionAsTeacher(session)));
            })
            .timeout(30 * 1000)
            .then(() =>{
                MatchMakerService.findMatchForSession(session, attempts + 1)
            })
        }
    }

    /**
     * gets 4 users that haven't already been contacted
     * @param session
     * @returns Promise < [user] > | Promise < null> if no more users
     */
    static getMatchedUsersForSession(session){
        let users;

        return Promise.join(
            session.load("skills"),
            DeclinedSession.where({session_id: session.get("id")}).fetchAll(),
            (session, declinedSessions) =>{
                let skillIds = session.related("skills")
                .map(skill => skill.get("id"));
                let declinedUserIds = declinedSessions.map(session => session.get("user_id"));
                declinedUserIds.push(session.get("pupil_id"));
                return MatchMakerService.getUserSkillCount(skillIds, declinedUserIds, 4)
            }
        )
        .then(userId_match =>{
            if (userId_match.length === 0){
                return Promise.resolve(null);
            } else {
                let userIds = Array.from(userId_match.keys());
                return User.where("id", "in", userIds).fetchAll()
                .then(u =>{
                    users = u;
                    let data = users.map(user =>{
                        return {user_id: user.get("id"), session_id: session.get("id")}
                    });
                    let newDeclined = DeclinedSession.forgeCollection(data);
                    return newDeclined.invokeThen("save");
                })
                .then(() => Promise.resolve(users))
            }

        })
    }

    /**
     * returns Promise resolving in Map<user_id, matchingSkillsCount>
     * @param skillIds
     * @param declinedUserIds
     * @param limit
     */
    static getUserSkillCount(skillIds, declinedUserIds, limit){
        const COUNT_NAME = "skills_count";

        return knex('skills_users')
        .count(`user_id as ${COUNT_NAME}`)
        .whereIn("skill_id", skillIds)
        .whereNotIn("user_id", declinedUserIds)
        .groupBy("user_id")
        .orderBy(COUNT_NAME, "DESC")
        .select('user_id')
        .limit(limit)
        .then(rows =>{
            let result = new Map();
            rows.forEach(row =>{
                result.set(row.user_id, parseInt(row[COUNT_NAME]))
            });
            return result;
        });
    }
}

module.exports = MatchMakerService;