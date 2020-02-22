## Todo
- [ ] Add user session creator vs session consumer modules
        see https://stackoverflow.com/a/53650554
        and https://nodejs.org/api/crypto.html#crypto_crypto_generatekeypair_type_options_callback
- [ ] Make Nest-based versioning S3 file manager service
    - [ ] Design api and functionality
        - [ ] QUESTIONS
            - [ ] WHAT ABOUT true deletion/overwriting?
            - [X] WHAT ABOUT custom roles?
                Application programmers handle custom roles by varying file permissions explicitly
                Application programmers can interact with custom roles in their own code
            - [X] WHAT IF two uploads are requested and processed out of order?
                They fill in the files without collision
                They set version history array entries without collision
                I think it's OK as long as version lister can deal with gaps in version history
        - [X] Directory structure
                    appBucket/ ----> Versioning is on, all of this is cached locally as it is used
                        _bannedUsers.json
                        _accountToHash.json 
                        _orgToHash.json
                        _folderToHash.json
                        organizationIdHash6_o_{id}/ <--- S3 recommends root folder starts with 6-8 hash-style chars
                            org.json
                            files.json <----------- Files an org has permissions to
                        accountIdHash6_u_{id}/ <--- S3 recommends root folder starts with 6-8 hash-style chars
                            account.json
                            files.json <----------- Files a user has permissions to
                        folderIdHash6_f_{id}/
                            list.json -----> incl. perms, only leaf perms.json needs to be checked
                            folderFoo/
                                list.json
                                fileFoo.bar/
                                    list.json
                    userBucket/ ---> Versioning is on, potentially controlled by customer
                        folderIdHash6_f_{id}/ <--- S3 recommends root folder starts with 6-8 hash-style chars
                            folderFoo/
                                fileFoo.bar/
                                    fileFoo.000001.bar
                                    fileFoo.000002.bar
                                    fileFoo.000003.bar
        - [ ] Wrapper SDK
            - [ ] Account
                - [ ] BanUsers({userId}[])
                - [ ] AddUsers({user}[])
                - [ ] AddOrg({org}[])
                - [ ] ModifyUsers({user}[])
                - [ ] ModifyOrgs({org}[])
            - [ ] Finder
                - [ ] ListFiles({folder, filename?}[] | {user}[])
                - [ ] GetPerms({folder, filename}[])
                - [ ] GetFiles({folder, filename, version?}[])
                - [ ] PutPerms({folder, filename, perms}[])
                - [ ] PutFiles({folder, filename, permissions, file}[])
                - [ ] DelFiles({folder, filename?}[])
        - [ ] Service list
            - [ ] Account Service (appBucket)
            - [ ] Finder Service (appBucket)
            - [ ] Upload Service (userBucket)
            - [ ] Commit Service (appBucket)
            - [ ] Download Service (userBucket)
        - [ ] Service details
            - [ ] Account Service
                - [ ] Responsibilities
                    TODO
                - [ ] permissions under appBucket/
                    - [ ] can create, read, and modify /_bannedUsers.json
                    - [ ] can create, read, and modify /_accountToHash.json
                    - [ ] can create, read, and modify /_orgToHash.json
                    - [ ] can create, read, and modify /_folderToHash.json
                    - [ ] can create, read, and modify */account.json
                    - [ ] can create, read, and modify */org.json
                - [ ] methods
                    - [ ] GetBannedUsers()
                    - [ ] BanUsers({userId}[])
                    - [ ] AddUsers({user}[])
                    - [ ] AddOrg({org}[])
                    - [ ] ModifyUsers({user}[])
                    - [ ] ModifyOrgs({org}[])
            - [ ] Finder Service
                - [ ] Responsibilities
                    - [ ] Respects access control info contained in list.json files
                    - [ ] Provides information about existing files and folders contained in list.json files
                    - [ ] Authorize creating or changing permissions of files or folders
                    - [ ] Perms can be based on user or organization
                    - [ ] Organizations are flat/dont nest (can only contain users)
                    - [ ] creates token for uploader to register new file version perms with app
                - [ ] permissions under appBucket/
                    - [ ] can read */**/list.json
                    - [ ] can read */org.json
                    - [ ] can read */files.json
                - [ ] methods
                    - [ ] RefreshBannedUsers()
                    - [ ] ListFolders({folder}[]) --------------> returns names
                    - [ ] ListFiles({folder}[] | {user}[]) -----> returns names
                    - [ ] ListVersions({folder, filename}[]) ---> returns numbers
                    - [ ] ListPerms({folder, filename}[]) ------> returns results
                    - [ ] HOW TO FIND all files a user has perms for?
                    - [ ] AuthorizeDownloads({folder, filename, version?}) -----> returns tokens(s) for Download Service
                    - [ ] AuthorizePerms({folder, filename?, perms}[]) ---------> returns token(s) passed to Upload for Commit Service
                    - [ ] AuthorizeUpload({folder, filename, permissions}[]) ---> returns token(s) passed to Upload for Commit Service
                    - [ ] AuthorizeDelete({folder, filename?}[]) ---------------> returns token(s) for Commit Service
            - [ ] Upload Service
                - [ ] Responsibilities
                    - [ ] creates pre-signed urls for uploading files to User bucket
                    - [ ] creates lambda that watches for uploaded file and calls Commit with info from signed token 
                    - [ ] bucket fires off lambda when upload completes
                    - [ ] Lambda automatically deletes when upload completes
                - [ ] permissions under userBucket/
                    - [ ] can create pre-signed url for uploading files to bucket
                    - [ ] can create lambda to watch for upload or register token and response with lambda
                - [ ] methods
                    - [ ] PrepareUploads({token}[]) ----> returns pre-signed url
            - [ ] Commit Service - Transactions joining appBucket & userBucket
                - [ ] Responsibilities
                    - [ ] Called by lambda created by Upload.PrepareUploads()
                    - [ ] Creates or updates appropriate appBucket/*/**/list.json based on Access Service tokens
                    - [ ] Logs all tokens received
                - [ ] permissions under appBucket/
                    - [ ] can read, create, and modify */**/list.json
                    - [ ] can read, create, and modify */files.json
                - [ ] methods
                    - [ ] Commit({token}[])
            - [ ] Download Service
                - [ ] Responsibilities
                    - [ ] Converts Finder tokens into presigned download urls
                    - [ ] Trusts File Service to authorize download url creation via tokens
                    - [ ] User forwards token to the Download Service
                    - [ ] Logs all tokens received
                    - [ ] Second set of eyes watching File Service
                    - [ ] File Service never sees the download urls
                - [ ] permissions under userBucket/
                    - [ ] can create pre-signed urls for downloading
                - [ ] methods
                    - [ ] PrepareDownloads({tokenFromFinder}[]) ---> returns pre-signed uri(s)
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
