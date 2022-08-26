import axios from "axios";
import app from "../src/index";
import {reviewService} from "../src/services";
import { testUserData, testGameData, testReviewData, testUserGameData, testGetAllGames, testfetchAllReviewData } from "./testdata";
import pool from "../src/mysql-pool";
axios.defaults.baseURL = "http://localhost:3001/api/v1";

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(3001, () => done());
}); 

afterAll((done) => {
    if (!webServer) return done.fail(new Error());
    webServer.close(() => pool.end(() => done()));
});
  
describe("Fetch users", () => {
    test("Fetch a user (200)", async () => {
        const id = {id: {id: 1}};
        const expected = testUserData[0];

        const response = await axios.post("/getUser", id);
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(expected);
    })
    test("Fetch a user (400)", async () =>{
        const id = {id: {}};
        const expected = [testUserData[0]]
        try {
            await axios.post("/getUser", id);
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

        const response = await axios.get("/getAllGames")
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(testGetAllGames);
    })
    test("fetch all games (500)", async () => {
        reviewService.getAllGames = jest.fn(() => Promise.reject(testGameData));
        await expect(() => axios.get("/getAllGames"))
        .rejects
        .toThrow("Request failed with status code 500");
    })
    test("Fetch one game (200)", async () => {
        const id = {id: {id: 1}};
        const expected = [testGetAllGames[0]]
        const response = await axios.post("/getGames", id);
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(expected);

    })
    test("Fetch one game (400)", async () => {
        const id = {id: {}};
        const expected = [testGetAllGames[0]]
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
        const newGame = {id: 300, name: "LOL", cover: {id: 82091, url: "//images.igdb.com/igdb/image/upload/t_cover_big/co1rcb.jpg"}, genres: [{id: 36, name: "MOBA"}]};

        const response = await axios.post("/saveGame", {game: newGame});
        expect(response.status).toEqual(201);
    })
    test("Save a game (400)", async () => {
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

        const response = await axios.post("/saveUserGame", {user_id: {id:1}, game_id: 300});
        expect(response.status).toEqual(201);
    })
    test("Save a user game (400)", async () => {

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

       const response = await axios.post("/removeUserGame", {user_id: {id:1}, game_id: 300});
        expect(response.status).toEqual(200);
    })
    test("Delete a game (400)", async () =>{
        
        try {
            const response = await axios.post("/removeUserGame", {user_id: {id: 1}});
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

        const response = await axios.post("/checkForGame", {user_id: {id:1}, game_id: 4});
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(expected);

    }) 
    test("Check for game (400)", async () => {
        const id = {user_id: {id:1}};
        const expected = [testUserData[0]]
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
    test("Fetch all reviews (200)", async () =>{
        const response = await axios.get("/getAllReviews")
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(testfetchAllReviewData);
    })
    test("Fetch all reviews(500)", async () => {
        reviewService.getAllReviews = jest.fn(() => Promise.reject(testReviewData))
        await expect(() => axios.get("/getAllReviews"))
        .rejects
        .toThrow("Request failed with status code 500");
    })
    test("Get game review (200)", async () =>{
        const expected = [testReviewData[0]];
        
        const response = await axios.post("/getGameReviews", {game_id: 4});
        expect(response.status).toEqual(200);
        expect(response.data).toEqual(expected);
    })
    test("Get game review (400)", async () => {
        const expected = [testReviewData[0]];
        
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

        const response = await axios.post("/getAvgRating", gameid);
        expect(response.status).toEqual(200);
    })
    test("Get average rating (400)", async () => {
        const gameid = {};
        
        try{
            await axios.post("/getAvgRating", gameid);
        }catch(error: any){
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
    // Skipping test to post a review, because the review_id is auto-increment and hard to retrieve in order to delete the correct review later.
    // The test below works, but as we didn't have a working test to delete it, we skip this one aswell. 
    test.skip("Add a review (201)", async () => {
        const response = await axios.post ("/postReview", {review: {
            user_id: 1,
            game_id: 300,
            title: "New review",
            details: "New review",
            rating: "3"
        }})
        expect(response.status).toEqual(201);
    })
    test("Add a review (400)", async () => {
        try {
            await axios.post("/postReview", {
                user_id: 1,
                game_id: 999,
                title: "New review",
                details: "New review",
                rating: "3"
            }); // <-- bad request
        } catch (error: any) {
            expect(error.response.status).toEqual(400);
        }
    })
    test("Add a review (500)", async () => {
        reviewService.postReview = jest.fn(() => Promise.reject());
        await expect(() => axios.post("/postReview", {review: {
            user_id: 1,
            game_id: 999,
            title: "New review",
            details: "New review",
            rating: "3"
        }}))
            .rejects
            .toThrow("Request failed with status code 500");
    })
    test("Edit a review (200)", async () => {
        const response = await axios.post ("/editReview", {review: {
            review_id:1, 
            title:"Good game",
            details:"Nice game",
            rating:3
        }});
        expect(response.status).toEqual(200);
    })
    test("Edit a review (400)", async () => {
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
            title:"Good game",
            details:"I really like it!",
            rating:3
        }}))
            .rejects
            .toThrow("Request failed with status code 500")
    })
    // Skipping test to delete a review, because the review_id is auto-increment and hard to retrieve in order to delete the correct review.
    // The below solution was attempted, but it did not work as hoped. 
    test.skip("Delete a review (200)", async () => {
        await axios.post("/getGameReviews", {game_id: 300})
            .then((response) => {
                return response.data.review_id;
            })
            .then((review_id) => {
                return axios.post("/deleteReview", {review_id: review_id});
            })
            .then((res) => {
                expect(res.status).toEqual(200);
            });
    })
    test("Delete a review(400)", async () => {
        const reviewid = {};

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

        const response = await axios.post("/upvoteReview", reviewid);
        expect(response.status).toEqual(200);
    })
    test("Upvote a review (400)", async () => {
        const reviewid = {};

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

        const response = await axios.post("/downvoteReview", reviewid);
        expect(response.status).toEqual(200);
    })
    test("Downvote a review (400)", async () => {
        const reviewid = {};

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