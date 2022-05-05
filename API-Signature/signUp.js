const requestBody = {
    firstName:"Srilekha",
    lastName:"Doosa",
    username:"sdoosa@stevens.edu",
    password:"56fge3",
    gender:"female",
    phone:"5524563452",
    description: "I am looking for a serious relationship",
    interests:["cricket", "music"],

    preferences:{
        genders:["male"],
        age:{min:22,max:28}
    },
    
};

const responseBody = {
    data: {message: "User Signed Up succesfully",
            link: "/users/login"}
};