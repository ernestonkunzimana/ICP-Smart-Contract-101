// filepath: /home/anonymous/Desktop/ICP-AZLE/ICP-azle-boilerplate/deploy.js
const { exec } = require('child_process');

function checkReplicaStatus(callback) {
    exec('dfx canister status --all', (err, stdout, stderr) => {
        if (err) {
            console.error(`Error checking replica status: ${err.message}`);
            setTimeout(() => checkReplicaStatus(callback), 2000); // Retry after 2 seconds
            return;
        }

        if (stderr) {
            console.error(`Replica status stderr: ${stderr}`);
            setTimeout(() => checkReplicaStatus(callback), 2000); // Retry after 2 seconds
            return;
        }

        if (stdout.includes('Running')) {
            callback();
        } else {
            console.log('Waiting for replica to be ready...');
            setTimeout(() => checkReplicaStatus(callback), 2000); // Retry after 2 seconds
        }
    });
}

function deploy() {
    exec('dfx deploy', (err, stdout, stderr) => {
        if (err) {
            console.error(`Error during deployment: ${err.message}`);
            return;
        }

        if (stderr) {
            console.error(`Deployment stderr: ${stderr}`);
            return;
        }

        console.log(`Deployment stdout: ${stdout}`);
    });
}

checkReplicaStatus(deploy);