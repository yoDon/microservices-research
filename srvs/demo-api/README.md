# Sample nestjs api project

When cloning to use as the basis for a new project:
- Provide a unique debug port number in project.json start:debug
- Clone Dockerfile-demoapi change the paths inside
- Add the new Dockerfile to docker-compose.yml, including matching the unique debug port number above
- Change the name of the RSA key shared with Main
- Change the contents of the RSA key shared with Main
- Clone the Main/src/demo project to expose the new api to main
- Provide main with matching RSA key value
- Whereever possible, place API functionality in a reusable/testable nestjs modules exported from npm package under pkgs
- All configuration should come from .env by way of envConstants.ts 