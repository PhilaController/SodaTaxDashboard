import { format } from "d3-format";

function getDownloadURL(kind) {

    let FILE_TAG;
    if (process.env.VUE_APP_SODA_MODE === 'staging') {
        FILE_TAG = "-staging";
    } else {
        FILE_TAG = "";
    }
    return `https://soda-tax-data-release-public.s3.amazonaws.com/${kind}${FILE_TAG}.csv`;
}


function formatNumber(d, digits = 3) {
    if (d == 0) return "$0";
    let fmtString = `,.${digits}s`;
    let s = `$${format(fmtString)(Math.abs(d)).replace(/G/, "B")}`;
    if (d < 0) s = "\u2212" + s;
    return s;
}

export { getDownloadURL, formatNumber };