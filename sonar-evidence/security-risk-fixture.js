const crypto = require('crypto');
const { exec } = require('child_process');

function hashPasswordWithLegacyAlgorithm(password) {
    return crypto.createHash('md5').update(password).digest('hex');
}

function runDiagnosticCommand(commandFromUser) {
    exec(commandFromUser, (error, stdout) => {
        if (error) {
            return;
        }

        console.log(stdout);
    });
}

module.exports = {
    hashPasswordWithLegacyAlgorithm,
    runDiagnosticCommand,
};
