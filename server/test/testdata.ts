export const testUserData = [
    {user_id: 1, username:"fabian"},
    {user_id: 2, username:"håkon"},
    {user_id: 3, username:"tord"}
];

export const testGameData = [
    {game_id:4,title:"Thief",cover: "//images.igdb.com/igdb/image/upload/t_cover_big/co22nc.jpg",genres: [{"id":5,"name":"Shooter"},{"id":31,"name":"Adventure"}]},
    {game_id:96,title:"Assassin's Creed: Brotherhood",cover: "//images.igdb.com/igdb/image/upload/t_cover_big/co1mxz.jpg" ,genres: [{"id":31,"name":"Adventure"}]},
    {game_id:113,title:"Need for Speed: Underground",cover:"//images.igdb.com/igdb/image/upload/t_cover_big/co209g.jpg",genres: [{"id":10,"name":"Racing"},{"id":13,"name":"Simulator"}]}
];

export const testReviewData = [
    {date: "18 November 2021", review_id:1, user_id:2, game_id:4, title:"Good game",details:"Nice game",rating:"3",relevance:12,review_date: "2021-11-17T23:00:00.000Z", username:"håkon"},
    {date: "19 November 2021", review_id:2, user_id:1, game_id:96, title:"Bad game",details:"Very bad game",rating:"1",relevance:5,review_date: "2021-11-18T23:00:00.000Z", username: "fabian"},
    {date: "17 November 2021",review_id:3, user_id:3, game_id:113, title:"best game ever",details:"best game ever",rating:"5",relevance:100,review_date:"2021-11-16T23:00:00.000Z", username:"tord"}
];

export const testUserGameData = [
    {user_id: 1, game_id: 4},
    {user_id: 2, game_id: 96},
    {user_id: 3, game_id: 113}
];

export const testGetAllGames = [
    {game_id: 4, title: "Thief", cover: "//images.igdb.com/igdb/image/upload/t_cover_big/co22nc.jpg", genres: "[{\"id\":5,\"name\":\"Shooter\"},{\"id\":31,\"name\":\"Adventure\"}]"},
    {game_id: 96, title: "Assassin's Creed: Brotherhood", cover: "//images.igdb.com/igdb/image/upload/t_cover_big/co1mxz.jpg", genres: "[{\"id\":31,\"name\":\"Adventure\"}]"},
    {game_id: 113, title: "Need for Speed: Underground", cover: "//images.igdb.com/igdb/image/upload/t_cover_big/co209g.jpg", genres: "[{\"id\":10,\"name\":\"Racing\"},{\"id\":13,\"name\":\"Simulator\"}]"},
    {game_id: 241, title: "Counter-Strike", cover: "//images.igdb.com/igdb/image/upload/t_cover_big/co3dav.jpg", genres: "[{\"id\":5,\"name\":\"Shooter\"}]"},
    {game_id: 300, title: "LOL", cover: "//images.igdb.com/igdb/image/upload/t_cover_big/co1rcb.jpg", genres: "[{\"id\":36,\"name\":\"MOBA\"}]"}
];

export const testfetchAllReviewData = [
    {
        "cover": "//images.igdb.com/igdb/image/upload/t_cover_big/co209g.jpg",
        "date": "17 November 2021",
        "details": "best game ever",
        "game_id": 113,
        "game_title": "Need for Speed: Underground",
        "genres": "[{\"id\":10,\"name\":\"Racing\"},{\"id\":13,\"name\":\"Simulator\"}]",
        "rating": "5",
        "relevance": 100,
        "review_date": "2021-11-16T23:00:00.000Z",
        "review_id": 3,
        "title": "best game ever",
        "user_id": 3,
        "username": "tord",
    },
    {
        "cover": "//images.igdb.com/igdb/image/upload/t_cover_big/co22nc.jpg",
        "date": "18 November 2021",
        "details": "Nice game",
        "game_id": 4,
        "game_title": "Thief",
        "genres": "[{\"id\":5,\"name\":\"Shooter\"},{\"id\":31,\"name\":\"Adventure\"}]",
        "rating": "3",
        "relevance": 12,
        "review_date": "2021-11-17T23:00:00.000Z",
        "review_id": 1,
        "title": "Good game",
        "user_id": 2,
        "username": "håkon",
    },
    {
        "cover": "//images.igdb.com/igdb/image/upload/t_cover_big/co1mxz.jpg",
        "date": "19 November 2021",
        "details": "Very bad game",
        "game_id": 96,
        "game_title": "Assassin's Creed: Brotherhood",
        "genres": "[{\"id\":31,\"name\":\"Adventure\"}]",
        "rating": "1",
        "relevance": 5,
        "review_date": "2021-11-18T23:00:00.000Z",
        "review_id": 2,
        "title": "Bad game",
        "user_id": 1,
        "username": "fabian",
    },
    {
        "cover": "//images.igdb.com/igdb/image/upload/t_cover_big/co3dav.jpg",
        "date": "22 November 2021",
        "details": "So I was playing this snowboarding game at the youth club. Then out of the blue, some older kids told me to shoot some hs. Didn't understand, but then they showed me 1.6, I was hooked immediately. Played it alle day everyday ever since.",
        "game_id": 241,
        "game_title": "Counter-Strike",
        "genres": "[{\"id\":5,\"name\":\"Shooter\"}]",
        "rating": "4",
        "relevance": 0,
        "review_date": "2021-11-21T23:00:00.000Z",
        "review_id": 7,
        "title": "Played at youth club",
        "user_id": 1,
        "username": "fabian",
    }
]