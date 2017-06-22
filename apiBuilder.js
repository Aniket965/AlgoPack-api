var fs = require('fs');
var colors = require('colors');
var exec = require('child_process').exec;
var rimraf = require('rimraf');
// module.exports = function () {
var apiDir = process.cwd() + '/_api';

if (!fs.existsSync(apiDir))
    fs.mkdirSync(apiDir);

var adsnRepoDir = process.cwd() + '/Algo_Ds_Notes';

// if (fs.existsSync(adsnRepoDir)) {
//     // removes old cloned repo
//     rimraf.sync(adsnRepoDir);
//     console.log("🍔 Deleted old Repo".yellow)
// }

// clone_adns_repo();
 
// deleting git repo from cloned repository
rimraf.sync(adsnRepoDir+'/.git');

var algoNames = dirs(process.cwd() + '/Algo_Ds_Notes')
console.log(algoNames);





// functions
function clone_adns_repo() {
    exec('git clone https://github.com/algobook/Algo_Ds_Notes.git', (err, stdout, stderr) => {
        if (err) {
            console.error(err);console.log("cloned");
        }else {
                console.log("cloned🎉🎉🎉🎉🎉".green);
        }
    });
}
/**
 * returns dirs in path
 */
function dirs(p) {
    return fs.readdirSync(p).filter(f => fs.statSync(p+"/"+f).isDirectory())
}
// }