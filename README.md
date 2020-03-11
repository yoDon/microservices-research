## Todo
- [ ] Use Redis cache
    - [ ] Cache sessions server-side in Redis
    - [ ] Stash banned users status in Redis
- [ ] Modular micro-services
    - [X] Additional nest boilerplate cleanup
        - [X] IUserApp, IUserInfo, IUserVisible are copy-and-pasted (should be non-nest code package)
    - [ ] Make Demo api & sdk module
        - [ ] Basics of demo-api NestJs project
            - [X] Basics of imported yodon-demo impl module
            - [ ] Basics of imported yodon-demo-sdk module
                - [ ] based on yodon-login-sdk or yodon-auth-sdk
                - [ ] yodon-demo|yodon-demo-sdk needs own RSA pair
                    - [ ] cryptoSign() and cryptoVerify() should take RSA key as argument so caller can name env var
                - [ ] CryptoJWT package
                    - [ ] create or verify JWTs
                    - [ ] create or verify nonces
                    - [ ] cache received nonces using node-cache
    - [ ] Each api should have an sdk module that talks to it
        - [ ] Main shares a public/private RSA key with each service that is used to sign auth tokens for 60 seconds
        - [ ] Tokens just say the bearer of this token is the named entity for the next 60 seconds
        - [ ] Tokens are specific to each service
        - [ ] Tokens just convey identity not authorization
        - [ ] Tokens have unique nonce for treating as single-use
        - [ ] Recipient of token is responsible for assessing authorization of identified holder
        - [ ] Recipient of token is responsible for treating as single-use
    - [ ] Make Nest-based versioning S3 file manager service
        - [ ] Start with just accessing previously uploaded files from a readonly file system
    - [ ] Docs
        - [ ] Explain how to make multiple permission keys for minimizing service accesses
    - [ ] Design api and functionality
        - [ ] Design Org storage.json schema and environment vars
            - Buckets are owned by special kind of org???
            - Environment: 
            - buckets.json: bucketIds and human readable descriptions
            - App keys to AdminService, FinderService (whole world in one bucket)
            - User Keys to DownloadService, CommitService (eventually also to UploadService) (one .env entry per bucketId)
        - [ ] Design Org files.json schema incl. different URI and post-download filenames
            - envStorage: {
                bucketId: string;
                cloud: aws|azure;
                accountPublic: string;
                accountSecret: string;
                bucketName: string;
                bucketType: app|userRW|userRO;
            }[]
            - file: {
                bucketType: app|userRW|userRO;
                cloud: {
                    bucketId: string;
                    folder: string;
                    file: string;
                }
                download: {
                    folder: string;
                    file: string; <---- procedurally inject version number if user requests
                };
                history: { <----------- only userRW, userRO
                    add: {
                        hash?: string; <----- same hash can appear more than once
                        size?: number;
                        cloudFile: string;
                    };
                    delete?: {
                        commitIds: string[];
                    };
                    commitDate: number;
                    commitingUserId: string;
                    commitId: string;
                }[];
            }
            - commit: {
                commitId: string;
                date: number;
                userId: string;
                files: file[];
            }
        - [ ] QUESTIONS
            - [X] HOW TO MIGRATE some files from one bucketId to another?
                - A:for now you can't
            - [X] HOW TO FIND all files a user can read or write?
                - A:Org perms can give users wildcard access, only user-explicit perms can be tracked
            - [X] WHAT IF two uploads are requested and processed out of order?
                - A:Version order is based on when you commit not when you request to upload
                    - Version stack is linear list of GUID-identified commits
            - [X] HOW TO TRACK commits?
                - Each upload has a commit ID (userID + commitID)
                - commit GUID is recorded in file.json history
                - commit details recorded in user's commit.json file 
            - [X] HOW TO RECORD commit comments?
                - if desired, application should include a commit file with each commit
            - [X] WHAT ABOUT merges and branches
                - A:merges and branches are application-level responsibility
                    - Merges are an app-specific, app developer problem not a library thing
                    - The app developer needs their own code flow to handle it
                    - If merges have to be app-specific, branches need to as well because branches are nothing without merges
            - [X] WHAT ABOUT true deletion/overwriting?
                - A:user-space operation on the user's bucket
            - [X] WHAT ABOUT custom roles?
                - A:custom roles are up to application developer
                    - Application programmers can interact with custom role ID's in their own code
                    - Application programmers handle custom roles by varying file permissions explicitly
        - [X] Bucket structure
                    appBucket000/ ----> Versioning is on, all of this is cached locally as it is used
                        _bans.json
                        _enterpriseToBucket.json
                    appBucketNNN/ ----> Versioning is on, all of this is cached locally as it is used
                        e/{enterpriseId}/ <------- S3 recommends root folder starts with 6-8 hash-style chars
                            enterprise.json
                            buckets.json <--------- bucketIds that can be distributed among cloud services
                            orgs.json
                            users.json
                            roles.json <----------- Role IDs are scoped by owning enterprise (can be granted to members of any enterprise)
                            files.json <----------- All files an enterprise is billed for
                        o/{orgId}/ <------- S3 recommends root folder starts with 6-8 hash-style
                            org.json
                            members.json
                            files.json <----------- All files an org has explicit permissions to
                        u/{userId}/ <--- S3 recommends root folder starts with 6-8 hash-style chars
                            account.json
                            files.json <----------- All files a user has explicit permissions to
                            commits.json <--------- Journal of all commits by user (accountId, date, multiple file versions or perm changes)
                        f/{folderId}/
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
                    userBucketReadOnlyFormatting/
                        whateverFolderStructure/.../
                            whateverFile.whatever
        - [ ] Wrapper SDK (client-side)
            - [ ] Account
                - [ ] Login
                - [ ] ModifySelf({userInfo})
            - [ ] Admin
                - [ ] Ban({user}[] | {org}[] | {enterpriseId}[])
                - [ ] AddUsers({user}[])
                - [ ] AddOrg({org}[])
                - [ ] ModifyUsers({user}[])
                - [ ] ModifyOrgs({org}[])
            - [ ] Finder
                - [ ] ListFolders({folder}[])
                - [ ] ListFiles({folder, filename?}[] | {user}[] | {folder, filename, version}[]) <-- last is for info on commit
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
                - [ ] permissions
                    - [ ] can create cryptographically signed session cookie
                    - [ ] can read data from Auth0 or etc.
                    - [ ] can modify user_metadata in Auth0 or etc.
                -[ ] methods
                    - [ ] Login()
                    - [ ] ModifySelf({userInfo})
            - [ ] Admin Service
                - [ ] Responsibilities
                    TODO
                - [ ] permissions under appBucket/
                    - [ ] can create, read, and modify /_bannedUsers.json
                    - [ ] can create, read, and modify /_accountToHash.json
                    - [ ] can create, read, and modify /_orgToHash.json
                    - [ ] can create, read, and modify /_folderToHash.json
                    - [ ] can create, read, and modify */account.json
                    - [ ] can create, read, and modify */org.json
                    - [ ] can create, read, and modify user_metadata and app_metadata in Auth0 or etc.
                - [ ] methods
                    - [ ] GetBannedUsers()
                    - [ ] Ban({enterpriseId}[] | {orgId}[] | {userId}[])
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
                    - [ ] can read */commits.json
                - [ ] methods
                    - [ ] RefreshBannedUsers()
                    - [ ] ListFolders({folder}[]) ----------------------> returns names
                    - [ ] ListFiles({folder, filename?}[] | {user}[] | {folder, filename, version}[]) <-- last is for info on commit
                    - [ ] ListPerms({folder, filename}[] | {user}[]) ---> returns perms for files or users
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
                    - [ ] PreviouslyUploaded({token}[])
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
                    - [ ] PrepareDownloads({tokenFromFinder, includeVersionNumber}[]) ---> returns pre-signed uri(s)
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
