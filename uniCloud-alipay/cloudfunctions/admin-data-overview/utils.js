const dayjs = require("dayjs");
function mergeAndSort(arr1, arr2, length=5) {
    const combinedMap = new Map();
    // 先将arr1的数据合并到combinedMap中
    arr1.forEach(item => {
        combinedMap.set(item.classid, (combinedMap.get(item.classid) || 0) + item.countTotal);
    });
    // 再将arr2的数据合并到combinedMap中
    arr2.forEach(item => {
        combinedMap.set(item.classid, (combinedMap.get(item.classid) || 0) + item.countTotal);
    });
    const combinedArray = Array.from(combinedMap, ([classid, countTotal]) => ({ classid, countTotal }));
    // 按照countTotal从大到小进行排序
    combinedArray.sort((a, b) => b.countTotal - a.countTotal);
    // 返回指定长度的数组
    return combinedArray.slice(0, length);
}


function getDatesBetween(startDate, endDate) {
	const start = dayjs(startDate);
	const end = dayjs(endDate);
	const dates = [];
	let currentDate = start;
	while (currentDate.isBefore(end) || currentDate.isSame(end)) {
		dates.push(currentDate.format('YYYY-MM-DD'));
		currentDate = currentDate.add(1, 'day');
	}
	return dates;
}

module.exports = {
	mergeAndSort,
	getDatesBetween
}