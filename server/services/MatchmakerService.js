const Promise = require("bluebird");
const DeclinedSession = require("../models/DeclinedSession");
const knex = require("../DB").knex;
const User = require("../models/User");

class MatchMakerService {

    static findMatchForSession(session){
        //while session not active
        //send match for following users=>
    }

    /**
     * gets 4 users
     * @param session
     */
    static getMatchedUsersForSession(session){
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
            let userIds = Array.from(userId_match.keys());
            return User.where("id", "in", userIds).fetchAll()
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