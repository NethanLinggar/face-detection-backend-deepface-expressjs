const {spawn} = require('child_process');

const pythonTest = (req, res) => {
    // Menentukan jalur skrip Python
    const pythonScriptPath = 'src/utils/python_test.py';

    const input = req.body;

    let python_result;

    // Mengonversi input menjadi string JSON
    const inputString = JSON.stringify(input);
    
    // Menjalankan skrip Python dengan spawn
    const pythonProcess = spawn('python', [pythonScriptPath, inputString]);
    
    // Menangani output dari skrip Python
    pythonProcess.stdout.on('data', (data) => {
        let output = data.toString().trim();
        const result = JSON.parse(output);
        python_result = result;
    });
    
    // Menangani error yang mungkin terjadi saat menjalankan skrip Python
    pythonProcess.stderr.on('data', (data) => {
        console.error(`Error: ${data.toString()}`);
    });
    
    // Menangani penyelesaian skrip Python
    pythonProcess.on('close', (code) => {
        if (code === 0) {
            res.json({
                message: 'Python script ran successfully.',
                data: python_result
            })
        } else {
            console.error(`Python script exited with error code ${code}`);
            res.send('Error');
        }
    });
}

module.exports = {
  pythonTest,
}