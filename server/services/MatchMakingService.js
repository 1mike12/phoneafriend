const DeclinedSession = require("../models/DeclinedSession");
const knex = require("../DB").knex;
const User = require("../models/User");
const Session = require("../models/Session");
const env = require("../env");
const SECONDS_BETWEEN_MATCHMAKING = process.env.NODE_ENV === "test" ? 0 : 60 * 1000;

class MatchMakingService {

    /**
     * attempts to find 3 users, repeat 4 times or @maxAttempts
     * @param session
     * @param maxAttempts
     * @return {Promise.<boolean>} - returns whether successfully found match
     */
    static async findMatchForSession(session, maxAttempts = 4){
        //while session not active
        //send match for following users=>
        let attemptsCount = 0;
        let foundMatch = false;
        while (attemptsCount < maxAttempts) {
            let users = await MatchMakingService.getMatchedUsersForSession(session, 3);
            attemptsCount++;

            if (users === null) break;

            await new Promise(resolve => setTimeout(() => resolve(), SECONDS_BETWEEN_MATCHMAKING))
            session = await Session.where({id: session.get("id")}).fetch()
            if (session.get("teacher_id")){
                foundMatch = true;
                break;
            }
        }
        return foundMatch;
    }

    /**
     * gets 4 users that haven't already been contacted, mark them as declined
     * @param session
     * @param usersAtATime
     * @returns Promise < [user] > | Promise < null> if no more users
     */
    static async getMatchedUsersForSession(session, usersAtATime = 4){
        let declinedSessions;

        [session, declinedSessions] = await Promise.all([
            session.load("skills"),
            DeclinedSession.where({session_id: session.get("id")}).fetchAll()
        ])

        let skillIds = session.related("skills").map(skill => skill.get("id"));

        let declinedUserIds = declinedSessions.map(session => session.get("user_id"));

        let userId_match = await MatchMakingService.getUserSkillCount(skillIds, declinedUserIds, usersAtATime)
        if (userId_match.size === 0) return null;
        let userIds = Array.from(userId_match.keys());

        let users = await User.where("id", "in", userIds).fetchAll()
        let data = users.map(user =>{
            return {user_id: user.get("id"), session_id: session.get("id")}
        });

        let newDeclined = DeclinedSession.forgeCollection(data);
        await newDeclined.invokeThen("save");
        return users;
    }

    /**
     * returns Promise resolving in Map<user_id, matchingSkillsCount>
     * @param skillIds
     * @param declinedUserIds
     * @param limit
     */
    static async getUserSkillCount(skillIds, declinedUserIds, limit){
        const COUNT_NAME = "skills_count";

        let rows = await knex('skills_users')
        .count(`user_id as ${COUNT_NAME}`)
        .whereIn("skill_id", skillIds)
        .whereNotIn("user_id", declinedUserIds)
        .groupBy("user_id")
        .orderBy(COUNT_NAME, "DESC")
        .select('user_id')
        .limit(limit)

        if (rows.length === 0) return null;

        let result = new Map();
        rows.forEach(row =>{
            result.set(row.user_id, parseInt(row[COUNT_NAME]))
        });
        return result;
    }
}

module.exports = MatchMakingService;