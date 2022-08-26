import axios from "axios";
import app from "../src/index";
import {reviewService} from "../src/services";

axios.defaults.adapter = require("axios/lib/adapters/http");
axios.defaults.baseURL = "http://localhost:3001/api/v1";

jest.mock("../src/services");

const testUserData = [
    {user_id: 1, username: "fabian"},
    {user_id: 2, username: "håkon"},
    {user_id: 3, username: "tord"}
];
const testGameData = [
    {game_id: 4, title: "Thief", cover: "//images.igdb.com/igdb/image/upload/t_cover_big/co22nc.jpg", genres: [{"id":5,"name":"Shooter"},{"id":31,"name":"Adventure"}]},
    {game_id: 96, title: "Assassin's Creed: Brotherhood", cover: "//images.igdb.com/igdb/image/upload/t_cover_big/co1mxz.jpg", genres: [{"id":31,"name":"Adventure"}]},
    {game_id: 113, title: "Need for Speed: Underground", cover:"//images.igdb.com/igdb/image/upload/t_cover_big/co209g.jpg", genres: [{"id":10,"name":"Racing"},{"id":13,"name":"Simulator"}]}
];
const testReviewData = [
    {
        "cover": "//images.igdb.com/igdb/image/upload/t_cover_big/co209g.jpg", 
        "date": "22 November 2021", 
        "details": "So I was playing this snowboarding game at the youth club. Then out of the blue, some older kids told me to shoot some hs. Didn't understand, but then they showed me 1.6, I was hooked immediately. Played it alle day everyday ever since.", 
        "game_id": 113, 
        "game_title": "Need for Speed: Underground", 
        "genres": "[{\"id\":10,\"name\":\"Racing\"},{\"id\":13,\"name\":\"Simulator\"}]", 
        "rating": "4", 
        "relevance": 0, 
        "review_date": "2021-11-21T23:00:00.000Z", 
        "review_id": 7, "title": 
        "Played at youth club", 
        "user_id": 1, 
        "username": "fabian"
    }
]
const testUserGameData = [
    {user_id: 1, game_id: 4},
    {user_id: 2, game_id: 96},
    {user_id: 3, game_id: 113}
]

let webServer: any;
beforeAll(() => (webServer = app.listen(3001)));
afterAll(done => {
    webServer.close()

    done();
});


describe("Fetch users", () => {
    test("Fetch a user (200)", async () => {
        const id = {id: {id: 1}};
        const expected = [testUserData[0]];

        // @ts-ignore
        reviewService.getUser = jest.fn(() => Promise.resolve(expected))

        const response = await axios.post("/getUser", id);
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(expected);
    })
    test("Fetch a user (400)", async () =>{
        const id = {id: {}};
        const expected = [testUserData[0]]

        // @ts-ignore
        reviewService.getGames = jest.fn(() => Promise.resolve(expected))
        try {
            const response = await axios.post("/getUser", id);
        } catch (error:any) {
            expect(error.response.status).toEqual(400);
        }
    })
    test("Fetch a user (500)", async () =>{
        const id = {id: {id: 1}};
        const expected = [testUserData[0]]
        reviewService.getUser = jest.fn(() => Promise.reject(expected))

        await expect(() => axios.post("/getUser", id))
        .rejects
        .toThrow("Request failed with status code 500");
    })
})
describe("Fetch games", () => {
    test("Fetch all games (200)", async () => {
        // @ts-ignore
        reviewService.getAllGames = jest.fn(() => Promise.resolve(testGameData))

        const response = await axios.get("/getAllGames")
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(testGameData);
    })
    test("fetch all games (500)", async () => {
        reviewService.getAllGames = jest.fn(() => Promise.reject(testGameData));
        await expect(() => axios.get("/getAllGames"))
        .rejects
        .toThrow("Request failed with status code 500");
    })
    test("Fetch one game (200)", async () => {
        const id = {id: {id: 1}};
        const expected = [testGameData[0]]
        // @ts-ignore
        reviewService.getGames = jest.fn(() => Promise.resolve(expected))
        const response = await axios.post("/getGames", id);
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(expected);

    })
    
    test("Fetch one game (400)", async () => {
        const id = {id: {}};
        const expected = [testGameData[0]]
        // @ts-ignore
        reviewService.getGames = jest.fn(() => Promise.resolve(expected))
        try {
            const response = await axios.post("/getGames", id);
        } catch (error: any) {
            expect(error.response.status).toEqual(400);
        }
    })
    test("Fetch one game(500)", async () =>{
        const id = {id: {id: 1}};
        const expected = [testGameData[0]]
        reviewService.getGames = jest.fn(() => Promise.reject(expected))

        await expect(() => axios.post("/getGames", id))
        .rejects
        .toThrow("Request failed with status code 500");
    })
})
describe("Games Post", () => {
    test("Save a game (201)", async () => {
        reviewService.saveGame = jest.fn(() => Promise.resolve());
        const newGame = {id: 1, name: "LOL", cover: {id: 82091, url: "//images.igdb.com/igdb/image/upload/t_cover_big/co1rcb.jpg"}, genres: [{id: 36, name: "MOBA"}]};

        const response = await axios.post("/saveGame", {game: newGame});
        expect(response.status).toEqual(201);
    })
    test("Save a game (400)", async () => {
        reviewService.saveGame = jest.fn(() => Promise.resolve());
        const newGame = {id: 1, name: "LOL", cover: {id: 82091, url: "//images.igdb.com/igdb/image/upload/t_cover_big/co1rcb.jpg"}, genres: [{id: 36, name: "MOBA"}]};

        try {
            await axios.post("/saveGame", {newGame}); // <-- bad request
        } catch (error: any) {
            expect(error.response.status).toEqual(400);
        }
    })
    test("Save a game (500)", async () => {
        reviewService.saveGame = jest.fn(() => Promise.reject());
        const newGame = {id: 1, name: "LOL", cover: {id: 82091, url: "//images.igdb.com/igdb/image/upload/t_cover_big/co1rcb.jpg"}, genres: [{id: 36, name: "MOBA"}]};


        await expect(() => axios.post("/saveGame", {game: newGame}))
        .rejects
        .toThrow("Request failed with status code 500");
    })
    test("Save a user game (201)", async () => {
        reviewService.saveUserGame = jest.fn(() => Promise.resolve());

        const response = await axios.post("/saveUserGame", {user_id: {id:1}, game_id: 96});
        expect(response.status).toEqual(201);
    })
    test("Save a user game (400)", async () => {
        reviewService.saveUserGame = jest.fn(() => Promise.resolve());

        try {
            await axios.post("/saveUserGame", {user_id:{id:1}});
        } catch (error: any) {
            expect(error.response.status).toEqual(400);
        }
    })
    test("Save a user game (500)", async () => {
        reviewService.saveUserGame = jest.fn(() => Promise.reject());

        await expect(() => axios.post("/saveUserGame",{user_id: {id:1}, game_id: 96}))
        .rejects
        .toThrow("Request failed with status code 500");
    })
    test("Delete a user game (200)", async () =>{
        reviewService.removeUserGame = jest.fn(() => Promise.resolve());

       const response = await axios.post("/removeUserGame", {user_id: {id:1}, game_id: 4});
        expect(response.status).toEqual(200);
    })
    test("Delete a game (400)", async () =>{
        reviewService.removeUserGame = jest.fn(() => Promise.resolve());
        
        try {
            const response = await axios.post("removeUserGame", {user_id: {id: 1}});
        } catch (error: any) {
            expect(error.response.status).toEqual(400);
        }
    })
    test("Delete a game (500)", async () => {
        reviewService.removeUserGame = jest.fn(() => Promise.reject());
        
        await expect(() => axios.post("/removeUserGame", {user_id: {id:1}, game_id: 4}))
        .rejects
        .toThrow("Request failed with status code 500");
    })
    test("Check for a game (200)", async () => {
        const expected = [testUserGameData[0]];
        // @ts-ignore
        reviewService.checkForGame = jest.fn(() => Promise.resolve(expected));

        const response = await axios.post("/checkForGame", {user_id: {id:1}, game_id: 4});
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(expected);

    }) 
    test("Check for game (400)", async () => {
        const id = {user_id: {id:1}};
        const expected = [testUserData[0]]
        // @ts-ignore
        reviewService.checkForGame = jest.fn(() => Promise.resolve(expected))
        try {
            const response = await axios.post("/checkForGame", id);
        } catch (error:any) {
            expect(error.response.status).toEqual(400);
        }
    })
    test("Check for a game (500)", async () =>{
        const expected = [testUserGameData[0]];
        reviewService.checkForGame = jest.fn(() => Promise.reject(expected));

        await expect (() => axios.post("/checkForGame", {user_id: {id:1}, game_id: 4}))
        .rejects
        .toThrow("Request failed with status code 500"); 
    })

})
describe("Fetch reviews", () => {
    test("Fetch all reviews (200)", async () => {
        // @ts-ignore
        reviewService.getAllReviews = jest.fn(() => Promise.resolve(testReviewData))

        const response = await axios.get("/getAllReviews")
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(testReviewData);
    })
    test("Fetch all reviews(500)", async () => {
        reviewService.getAllReviews = jest.fn(() => Promise.reject(testReviewData))
        await expect(() => axios.get("/getAllReviews"))
        .rejects
        .toThrow("Request failed with status code 500");
        
    })
    test("Get game review (200)", async () =>{
        const expected = [testReviewData[0]];
        // @ts-ignore
        reviewService.getGameReviews = jest.fn(() => Promise.resolve(expected));
        
        const response = await axios.post("/getGameReviews", {game_id: 113});
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(expected);

    })
    test("Get game review (400)", async () => {
        const expected = [testReviewData[0]];
        // @ts-ignore
        reviewService.getGameReviews = jest.fn(() => Promise.resolve(expected));
        
        try {
            const response = await axios.post("/getGameReviews", {});
        } catch (error: any) {
            expect(error.response.status).toEqual(400);
        }
    })
    test("Get game review (500)", async () => {
        const expected = [testReviewData[0]];
        reviewService.getGameReviews = jest.fn(() => Promise.reject(expected));
        
        await expect(() => axios.post("/getGameReviews", {game_id: 4}))
        .rejects
        .toThrow("Request failed with status code 500");
    })
    test("Get average rating (200)", async () => {
        const gameid = {game_id: 4};
        // @ts-ignore
        reviewService.getAvgRating = jest.fn(() => Promise.resolve());

        const response = await axios.post("/getAvgRating", gameid);
        expect(response.status).toEqual(200);
    })
    test("Get average rating (400)", async () => {
        const gameid = {};
        // @ts-ignore
        reviewService.getAvgRating = jest.fn(() => Promise.resolve());
        
        try {
            await axios.post("/getAvgRating", gameid);
        } catch(error: any){
            expect(error.response.status).toEqual(400);
        }
        
    })
    test("Get average rating (500)", async() => {
        const gameid = {game_id: 4};
        reviewService.getAvgRating = jest.fn(() => Promise.reject());

        await expect(() => axios.post("/getAvgRating", gameid))
        .rejects
        .toThrow("Request failed with status code 500");
    })

})
describe("Reviews POST", () =>{
    test("Add a review (201)", async () => {
        reviewService.postReview = jest.fn(() => Promise.resolve());

        const response = await axios.post ("/postReview", {review: {
            review_id: 4,
            user_id: 1,
            game_id: 113,
            title: "Played at youth club",
            details: "So I was playing this snowboarding game at the youth club. Then out of the blue, some older kids told me to shoot some hs. Didn't understand, but then they showed me 1.6, I was hooked immediately. Played it alle day everyday ever since.",
            rating: "4",
            relevance: 69,
            review_date: "2021-11-17T23:00:00.000Z"
            }  
        })
        expect(response.status).toEqual(201);
    })
    test("Add a review (400)", async () => {
        reviewService.postReview = jest.fn(() => Promise.resolve());

        try {
            await axios.post("/postReview", {
                review_id: 4,
                user_id: 1,
                game_id: 113,
                title: "Played at youth club",
                details: "So I was playing this snowboarding game at the youth club. Then out of the blue, some older kids told me to shoot some hs. Didn't understand, but then they showed me 1.6, I was hooked immediately. Played it alle day everyday ever since.",
                rating: "4",
                relevance: 69,
                review_date: "2021-11-17T23:00:00.000Z"
            }); // <-- bad request
        } catch (error: any) {
            expect(error.response.status).toEqual(400);
        }
    })
    test("Add a review (500)", async () => {
        reviewService.postReview = jest.fn(() => Promise.reject());

        await expect(() => axios.post("/postReview", {review: {
            review_id: 4,
            user_id: 1,
            game_id: 113,
            title: "Played at youth club",
            details: "So I was playing this snowboarding game at the youth club. Then out of the blue, some older kids told me to shoot some hs. Didn't understand, but then they showed me 1.6, I was hooked immediately. Played it alle day everyday ever since.",
            rating: "4",
            relevance: 69,
            review_date: "2021-11-18"
            }} ))
        .rejects
        .toThrow("Request failed with status code 500");
    })
    test("Edit a review (200)", async () => {
        reviewService.editReview = jest.fn(() => Promise.resolve());

        const response = await axios.post ("/editReview", {review: 
            {review_id:1, 
            user_id:2, 
            game_id:4,
            title:"Bad game",
            details:"Nice game",
            rating:3,
            relevance:12,
            review_date: "2021-11-18"} 
        })
        expect(response.status).toEqual(200);

    })
    test("Edit a review (400)", async () => {
        reviewService.editReview = jest.fn(() => Promise.resolve());
        try {
            await axios.post("/editReview", {} 
            )
        } catch (error: any) {
            expect(error.response.status).toEqual(400);
        }
    })
    test("Edit a review (500)", async () => {
        reviewService.editReview = jest.fn(() => Promise.reject());

        await expect(() => axios.post ("/editReview", {review: {
            review_id:1, 
            user_id:2, 
            game_id:4,
            title:"Bad game",
            details:"Nice game",
            rating:3,
            relevance:12,
            review_date: "2021-11-18"
            }} ))
            .rejects
            .toThrow("Request failed with status code 500")
        })
    test("Delete a review (200)", async () => {
        const reviewid = {review_id: 1}
        reviewService.deleteReview = jest.fn(() => Promise.resolve());

        const response = await axios.post("/deleteReview", reviewid);
        expect(response.status).toEqual(200);
    })
    test("Delete a review(400)", async () => {
        const reviewid = {};
        reviewService.deleteReview = jest.fn(() => Promise.resolve());

        try {
            await axios.post("/deleteReview", reviewid)
        }catch(error: any){
            expect(error.response.status).toEqual(400);
        }
    })
    test("Delete a review(500)", async () => {
        const reviewid = {review_id: 1}
        reviewService.deleteReview = jest.fn(() => Promise.reject());

        await expect(() => axios.post("/deleteReview", reviewid))
        .rejects
        .toThrow("Request failed with status code 500");
    })
    test("Upvote a review (200)", async () => {
        const reviewid = {review_id: 1}
        reviewService.upvoteReview = jest.fn(() => Promise.resolve());

        const response = await axios.post("/upvoteReview", reviewid);
        expect(response.status).toEqual(200);
    })
    test("Upvote a review (400)", async () => {
        const reviewid = {};
        reviewService.upvoteReview = jest.fn(() => Promise.resolve());

        try {
            await axios.post("/upvoteReview", reviewid)
        }catch(error: any){
            expect(error.response.status).toEqual(400);
        }
    })
    test("Upvote a review (500)", async () => {
        const reviewid = {review_id: 1}
        reviewService.upvoteReview = jest.fn(() => Promise.reject());

        await expect(() => axios.post("/upvoteReview", reviewid))
        .rejects
        .toThrow("Request failed with status code 500");
    })
    test("Downvote a review (200)", async () => {
        const reviewid = {review_id: 1}
        reviewService.downvoteReview = jest.fn(() => Promise.resolve());

        const response = await axios.post("/downvoteReview", reviewid);
        expect(response.status).toEqual(200);
    })
    test("Downvote a review (400)", async () => {
        const reviewid = {};
        reviewService.downvoteReview = jest.fn(() => Promise.resolve());

        try {
            await axios.post("/downvoteReview", reviewid)
        }catch(error: any){
            expect(error.response.status).toEqual(400);
        }
    })
    test("Downvote a review (500)", async () => {
        const reviewid = {review_id: 1}
        reviewService.downvoteReview = jest.fn(() => Promise.reject());

        await expect(() => axios.post("/downvoteReview", reviewid))
        .rejects
        .toThrow("Request failed with status code 500");
    })
})
