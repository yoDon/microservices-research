## Todo
- [ ] Make Nest-based versioning S3 storage service
    - [ ] Design api and functionality
- [ ] use S3 for banning users
    - [ ] on startup download bannedUsers list from S3
    - [ ] expose api method to refresh/redownload bannedUsers list from S3
- [ ] Log recent users
    - [ ] admin controller to show list of AuthService.activeUsers
    - [ ] web-app UI to show active users
- [ ] web-app get user info from /api/auth/userinfo using cookie
    - [ ] Q: use context provider to hold user login info after login (and clear in postlogout)
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
