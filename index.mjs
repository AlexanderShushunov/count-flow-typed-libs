import fs from 'fs';
import util from 'util';
import _ from 'lodash/fp';
import nrc from 'node-run-cmd';

const readdir = util.promisify(fs.readdir);
const exists = util.promisify(fs.exists);

const cutVersion = dir => {
    const verStart = dir.lastIndexOf('_');
    if (verStart === -1) {
        return dir;
    } else {
        return dir.substr(0, verStart);
    }
};

exists('./flow-typed/.git')
    .then(alreadyCloned =>
        alreadyCloned
            ? 'git -C ./flow-typed pull'
            : 'git clone git@github.com:flowtype/flow-typed.git'
    )
    .then(nrc.run)
    .then(() => readdir('./flow-typed/definitions/npm/'))
    .then(_.map(cutVersion))
    .then(_.uniq)
    .then(_.size)
    .then(console.log);

