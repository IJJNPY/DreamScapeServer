export const cloudToHttps = (str)=>{
	return str.replace("cloud://", "https://")
	.replace(str.split("/")[2], str.split("/")[2] + ".normal.cloudstatic.cn");	
}


export function compressAndConvertToWebP(blob, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = blob;
        
        img.onload = () => {
            // 创建一个canvas元素
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            // 使用canvas的toBlob方法将图像转换为WebP格式
            canvas.toBlob((webpBlob) => {
                const webpBlobUrl = URL.createObjectURL(webpBlob);
                resolve(webpBlobUrl);
            }, 'image/webp', quality);
        };
        
        img.onerror = (error) => {
            reject(error);
        };
    });
}


export function getSmallImg(url,width=100){
	if(url) return url+"?x-oss-process=image/resize,w_"+width;
	else return "../../static/images/notPic.png"
}


export function truncateString(str, num=15) {
    if (str.length > num) {
        return str.slice(0, num) + "...";
    }
    return str;
}
