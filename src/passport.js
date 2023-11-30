import passport from "passport";
import { usersManager } from "./dao/managers/usersManager.js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt"
import { hashData, compareData } from "./utils.js";

const SECRETJWT= "jwtSecret";



// local

passport.use("signup", new LocalStrategy(
  {
    passReqToCallback: true,
    usernameField: "email"
  },
  async (req, email, password, done) => {
    const { first_name, last_name } = req.body;
    if (!first_name || !last_name || !email || !password) {
      return done(null, false);
    }
    try {
      const hashedPassword = await hashData(password);
      const createdUser = await usersManager.createOne({
        ...req.body,
        password: hashedPassword,
      });
      done(null, createdUser);
    } catch (error) {
      done(error);
    }
  }
)
);

passport.use("login", new LocalStrategy(

  { usernameField: "email" },

  async (email, password, done) => {
    if (!email || !password) {
      done(null, false, { message: "All fields are required" });
    }
    try {
      const user = await usersManager.findByEmail(email);
      if (!user) {
        done(null, false, { message: "Incorrect email or password." });
      }

      const isPasswordValid = await compareData(password, user.password);
      if (!isPasswordValid) {
        console.log("pass incorrecto");
        return done(null, false, { message: "Incorrect email or password." });
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
)
);

// github
passport.use(
  "github",
  new GithubStrategy(
    {
      clientID: "Iv1.c79d3edc2c7b8c91",
      clientSecret: "8eab733068a67c52e7d180f128533ee5d45bf8d7",
      callbackURL: "http://localhost:8080/api/sessions/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let mailUser = profile._json.email ? profile._json.email : profile._json.login + "@gmail.com"
        const userDB = await usersManager.findByEmail(mailUser);
        // login
        if (userDB) {
          if (userDB.isGithub) {
            return done(null, userDB);
          } else {
            return done(null, false);
          }
        }
        // signup

        let nameParts = profile._json.name ? profile._json.name.split(" ") : mailUser.split("@");
        let ageUser = profile._json.age ? profile._json.age : 0
        const infoUser = {
          first_name: nameParts[0],
          last_name: nameParts[0],
          email: mailUser,
          age: ageUser,
          password: " ",
          isGithub: true,
        };
        const createdUser = await usersManager.createOne(infoUser);
        done(null, createdUser);
      } catch (error) {
        done(error);
      }
    }
  )
);


const fromCookies= (req)=>{
  return req.cookies.token;
}

//JWT
passport.use("jwt", new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromExtractors([fromCookies]),
  secretOrKey:SECRETJWT,
},(jwt_payload, done)=>{
  done(null,jwt_payload)
})
);





passport.serializeUser((user, done) => {

  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await usersManager.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});