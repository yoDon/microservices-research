## Notes

- NestJS authorization example at https://auth0.com/blog/developing-a-secure-api-with-nestjs-adding-authentication/

## Todo
- [X] Add basic Material-UI support incl. React-Beautiful-DnD and React-Router
- [X] Add basic NestJS backend
    - [X] Add Swagger API docs
    - [X] Add service wth DTO data validation
    - [X] Turn on async controllers
- [ ] Add Auth0.com API authorization
    - [X] Sign up for Auth0
    - [X] use NestJS guards for authorization
    - [ ] Add sign-in page to web-app frontend  
    - [ ] Setup and use app_metadata (eg. for simulated account billing status)
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
