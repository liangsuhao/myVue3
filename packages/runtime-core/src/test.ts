// 优化： 用最长递增子序列进行优化
const arr = [2,3,1,5,6,8,7,9,4];
// 1 3 4 6 7 9
// 2 3 5 6 7 9
// const arr = [1,2,3,4,5,0];

// 二分查找
function getSequence(arr) {
    let len = arr.length;
    let start, end, middle;
    const result = [0];
    const p = arr.slice();
    for(let i = 1 ; i < len ; i++) {
        if(arr[i] !== 0) {
            const lastIndex = result[result.length - 1];
            if(arr[i] > arr[lastIndex]) {
                p[i] = lastIndex;
                result.push(i);
                continue;
            }
            // 二分查找替换
            start = 0;
            end = result.length - 1;
            while(start < end) {
                middle = Math.floor((start + end) / 2);

                if(arr[result[middle]] < arr[i]) {
                    start = middle + 1;
                } else {
                    end = middle;
                }
            }
            // 找到对应的位置
            if(arr[i] < arr[result[start]]) {
                if(start > 0) {
                    p[i] = result[start-1];
                }
                result[start] = i;
            }
        }
    }

    // 循环获取数据
    let len1 = result.length;
    let last = result[len1-1];
    while(len1--) {
        result[len1] = last;
        last = p[last];
    }
    return result;
}

console.log(getSequence(arr))