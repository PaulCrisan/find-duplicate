const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

if (process.argv.length <= 2) {
  console.log("Usage: " + __filename + " path/to/directory");
  process.exit(0);
}

const PATH = path.normalize(process.argv[2]);

var walkSync = function (dir, filelist) {
  var path = path || require("path");
  var fs = fs || require("fs"),
    files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function (file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    } else {
      filelist.push(path.join(dir, file));
    }
  });
  return filelist;
};

const scssArray = walkSync(PATH).filter((fn) => fn.endsWith(".scss"));

const readFile = (filename) => {
  var contents = fs.readFileSync(filename);
  return contents;
};

const makeHash = (fileString) => {
  return crypto.createHash("md5").update(fileString).digest("hex");
};

const createAsoc = (fileListArray) => {
  let asoc = [];
  fileListArray.map((scss) => {
    asoc.push({ path: scss, hash: makeHash(readFile(scss)) });
  });

  return asoc;
};

const getResult = () => {
  const asoc = createAsoc(scssArray);

  const uniqueHash = Array.from(new Set(asoc.map((a) => a.hash)));

  let hashObj = {};

  uniqueHash.map((e) => {
    hashObj[e] = new Array();
  });
  for (let i = 0; i < asoc.length; i++) {
    for (let j = 0; j < uniqueHash.length; j++) {
      if (asoc[i].hash === uniqueHash[j]) {
        hashObj[uniqueHash[j]].push(asoc[i].path);
      }
    }
  }

  let flag = false;

  Object.values(hashObj).map((el) => {
    if (el.length > 1) {
      flag = true;

      console.log(
        "\x1b[36m%s\x1b[0m",
        "Fisierele duplicat si locul lor sunt: \n"
      );

      el.map((e) => {
        console.log("\x1b[33m", e + "\n");
      });

      console.log("\n");
    }
  });

  flag
    ? ""
    : console.log(
        "\x1b[36m%s\x1b[0m",
        "Nu sunt fisiere duplicat in acest fisier"
      );
};

getResult();
