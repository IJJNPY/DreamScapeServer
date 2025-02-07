export const cloudToHttps = (str) => {
	return str.replace("cloud://", "https://").replace(str.split("/")[2],str.split("/")[2]+".normal.cloudstatic.cn");
}

export function compressImage(url, quality = 0.8) {
  return new Promise((resolve, reject) => {
    // 创建一个 Image 对象
    const img = new Image();
    img.onload = async () => {
      // 创建一个 canvas 元素
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      // 将图片绘制到 canvas 上
      ctx.drawImage(img, 0, 0);
      // 获取压缩后的图片数据
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      // 创建一个 Blob 对象
      const blob = await (await fetch(compressedDataUrl)).blob();
      // 创建一个新的 URL 用于存储压缩后的图片
      const compressedUrl = URL.createObjectURL(blob);
      resolve(compressedUrl);
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = url;
  });
}

export function getSmallImg(url,width=100){
	if(url) return url+"?x-oss-process=image/resize,w_"+width;
	else return "/static/logo.png"
}