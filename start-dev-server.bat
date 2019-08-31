start cmd /c "npm run build"
start cmd /c "npm run build-server"
::start cmd /c "cd C:\Program Files\MongoDB\Server\3.6\bin && mongod"
timeout 5
start cmd /c "npm run start-dev"