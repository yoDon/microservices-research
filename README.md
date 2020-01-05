## Todo
- [X] Add basic Material-UI support incl. React-Beautiful-DnD and React-Router
- [X] Add basic NestJS backend
    - [X] Add Swagger API docs
    - [X] Add service wth DTO data validation
    - [X] Turn on async controllers
- [X] Add Auth0.com authorization
    - [X] Sign up for Auth0
    - [X] use NestJS guards for authorization
    - [X] NestJS should use Auth0 jwt to authenticate users on initial signin, then session cookies afterwards
        - [X] NestJS should serve site as static content so API and frontend can be on same domain for cookie handling
            - https://stackoverflow.com/questions/55325062/how-to-serve-static-html-files-in-nest-js
            - https://docs.nestjs.com/techniques/mvc
        - [X] Auth0 login page should post to server AND server should send cookie to front-end
            - https://github.com/nestjs/docs.nestjs.com/issues/237
            - https://dev.to/nestjs/authentication-and-sessions-for-mvc-apps-with-nestjs-55a4
            - https://auth0.com/docs/login/spa/authenticate-with-cookies
            - https://developer.okta.com/blog/2019/09/19/nodejs-typescript
            - https://medium.com/@saurssaurav33/start-react-with-auth0-107525cb969
            - https://auth0.com/blog/developing-a-secure-api-with-nestjs-adding-authentication/
            - [X] auth0 login page tells browser to redirect to server URL localhost:3001//api/login
            - [X] implement NestJS localhost:3001/api/prelogin and localhost:3001/api/postlogin 
                - [X] use nestjs-cookie-session to generate httpOnly session
                - [X] unpack auth0 userinfo response into session cookie
                - [X] server tells browser to redirect back to SPA (at address in state) with cookies
        - [X] Implement logout
        - [X] Add non-httpOnly cookie that indicates if user is logged in or not
    - [X] Add sign-in controls to web-app frontend
        - [X] use NestJS to serve site
            - [X] NestJS should use cpx --clean source dest to publish
        - [X] add Auth widget that shows or hides login/logout/signup buttons (and User identity button?)
            - [X] use non-httpOnly user cookie
            - [X] Login button should redirect to /api/auth/prelogin
            - [X] Logout button should redirect to /api/auth/prelogout
            - [X] Signup button should redirect to ??? (same as login?)
- [ ] Add Auth0.com API authorization
    - [ ] Implement example session-authenticated controller that respects bannedUsers list
        - [ ] future requests from browser are authenticated with session cookie
        - [ ] check if user is in bannedUsers list and if so log and ban
        - [ ] build list of who NestJS has created sessions for
        - [ ] Setup and use app_metadata (eg. for simulated account billing status)
        - [ ] session authenticated get user info controller that respects bannedUsers list
        - [ ] admin controller to show list of created sessions/users
        - [ ] admin controller to ban a user and their session
    - [ ] Remove unused JWT strategy packages
    - [ ] web-app get user info from /api/auth/userinfo using cookie
        - [ ] Q: use context provider to hold user login info after login (and clear in postlogout)
- [ ] Update NestJS to Swagger 4
    - https://trilon.io/blog/nestjs-swagger-4-whats-new
    - [ ] do whatever is needed regarding dto's (see demo controller for example)
- [ ] Make Nest-based storage service with node-cache (npm module) based versioning file system service
    - [ ] Cache need to deal with marking objects as dirty - writing app responsible for maintaining singgle source of truth
        - [ ] Check if path is in cache, if not load 0 version from file system (in future from S3)
        - [ ] On save write as 0 version and highest numbered version
- [ ] Add Electron hosting of NestJS
    - [ ] Freshen Electron-GraphQL
    - [ ] Q: Use my approach or mimic angular-console's old hosting of NestJS in electron
        - see https://github.com/nrwl/angular-console/blob/a43432ce8565fa374383a0047f63f71971a40537/apps/electron/src/app/start-server.ts
        - angular-console has since switched from NestJS in electron to VS Code
	- [ ] Q: see if saltyshiomix has thought about hosting NestJS in electron?

https://dev-h-vc-i52.auth0.com/authorize?audience=http://localhost:3001&scope=SCOPE&response_type=code&client_id=VdJStC1iuBKpVfwT2MyEyVkIdTAycMna&redirect_uri=http://localhost:3000/postlogin&state=STATE?prompt=none


curl -X POST -H "content-type: application/json" -d "{ \"grant_type\": \"authorization_code\", \"client_id\": \"VdJStC1iuBKpVfwT2MyEyVkIdTAycMna\", \"client_secret\": \"NagJvCXgC-iYbzslZt-J_nmJ1i5xNPE3-Yr_0xKtjsnSqdlAIba5SybeB7t4Vced\", \"code\": \"KT6xuJxyDzQ1s6ni\", \"redirect_uri\": \"http://localhost:3000/postlogin\" }" https://dev-h-vc-i52.auth0.com/oauth/token

curl -X POST -H "authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJqTkJNamcyTmpZeE5UZEJNVUZCUkRneU1ETXlSVUV3UXpWQk9VUTBSakkzUlRCRU0wVTBOUSJ9.eyJpc3MiOiJodHRwczovL2Rldi1oLXZjLWk1Mi5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NWRkODAyYmY0NTQxNzcwZWY3NjE2Nzk5IiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDozMDAxIiwiaWF0IjoxNTc0NDM4MDU3LCJleHAiOjE1NzQ1MjQ0NTcsImF6cCI6IlZkSlN0QzFpdUJLcFZmd1QyTXlFeVZrSWRUQXljTW5hIn0.ywlMTbmaF0SHEh48ktJbXZujdKqeJvvDlqUBP6PSQ6PR3MqtHn9mi6Y7xS2u7VJDI8z5a9M7-eeP3xto-XO0qiGiFPF0sH7GAUf7UUknM3Tr8li4CRzNskQMbMqBm-9E1B3vnN2pgLm6BycLu1a7TwcSljGrfTSSD_Zlsi1_rtqBybDNe5V71r3mpLyLnJtqPAo0HaJQXAx2u51_Qt6siixl3ezp3DvYxdo5DbEfLbaIRw2fYGVjeBSufVLy81-d5d06dfecG3S1q0e9ROojdCK1bKK66yIXSZN7nmMx6fWmC_dwyCvY2I19WXY-__EDfKbJ0ZZQ01WJ12zu8MubmQ" "http://localhost:3001/api/demo" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"one\": \"string\", \"two\": \"string\"}"

// Name: App01
// ApiAudience: http://localhost:3001
// Domain: dev-h-vc-i52.auth0.com
// ClientId: VdJStC1iuBKpVfwT2MyEyVkIdTAycMna
// ClientId: VdJStC1iuBKpVfwT2MyEyVkIdTAycMna
// ClientSecret: NagJvCXgC-iYbzslZt-J_nmJ1i5xNPE3-Yr_0xKtjsnSqdlAIba5SybeB7t4Vced
// Allowed web origin: http://localhost:3000
// Allowed callback urls: http://localhost:3000/postlogin
// Allowed logout urls: http://localhost:3000/postlogout
// audience is http://localhost:3000 ?????
