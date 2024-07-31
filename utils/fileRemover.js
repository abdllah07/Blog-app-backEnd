import fs from 'fs';
import path from 'path';

const fileRemover = (filename) => {
    fs.unlink(path.join(__dirname, '../uploads', filename) , function (err) {
        if (err && err.code == "ENOENT") {
            // file doesn't exist 
            console.log(`File ${filename} does not exist , won't remove it `)
        }else if (err) {
            console.error(`Error occurred while trying to removing file ${filename}:`, err);
        }else {
            console.log(`remover ${filename}`)
        }
    })
}


export {fileRemover}