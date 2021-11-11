import { format } from "d3-format";
import { csv } from "d3-fetch"

function getDownloadURL(kind) {

    let FILE_TAG;
    if (process.env.VUE_APP_SODA_MODE === 'staging') {
        FILE_TAG = "-staging";
    } else {
        FILE_TAG = "";
    }
    return `https://soda-tax-data-release-public.s3.amazonaws.com/${kind}${FILE_TAG}.csv`;
}

async function fetchAWS(kind) {

    let url = getDownloadURL(kind)
    try {
        const data = await csv(url);
        return data
    } catch (e) {
        console.error(e);
    }
}

async function fetchLatestRelease(filetag) {

    let endpoint = "https://soda-tax-data-release-public.s3.amazonaws.com/"
    let FILE_TAG;
    if (process.env.VUE_APP_SODA_MODE === 'staging') {
        FILE_TAG = "-staging";
    } else {
        FILE_TAG = "";
    }
    let url = endpoint + "latest-release" + FILE_TAG + ".json"
    try {
        const response = await fetch(url);
        let data = await response.json();
        return data
    } catch (e) {
        console.error(e);
    }
}


function formatNumber(d, digits = 3) {
    if (d == 0) return "$0";
    let fmtString = `,.${digits}s`;
    let s = `$${format(fmtString)(Math.abs(d)).replace(/G/, "B")}`;
    if (d < 0) s = "\u2212" + s;
    return s;
}

export { getDownloadURL, formatNumber, fetchAWS, fetchLatestRelease };