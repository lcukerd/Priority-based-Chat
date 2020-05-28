const { exec } = require("child_process");

let count = 20;
while (count--) {
    console.log(`Starting client ${20 - count}`);
    exec('node src/client.js', (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}