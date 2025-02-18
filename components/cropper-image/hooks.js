import { computed, nextTick, ref } from 'vue';

export function useCropper(cropperRef){
	const options = ref({
		outputType:"webp",
		autoCrop:true,
		fixed:true,
		fixedNumber:[9,16],
		infoTrue:true,
		full:true,
		maxImgSize:3000,
		fillColor:"#000"
	});
	
	const fnConfig = ref([
		{type:"auto",text:"自由裁剪",icon:"icon-expend"},
		{type:"1/1",text:"1 / 1",icon:""},
		{type:"9/16",text:"9 / 16",icon:""},
		{type:"9/20",text:"9 / 20",icon:""},
		{type:"rotate",text:"向右旋转",icon:"icon-rotate-right"},
		{type:"zoomin",text:"放大",icon:"icon-zoomin"},
		{type:"zoomout",text:"缩小",icon:"icon-zoomout"}
	]);
	
	const editImg = (type) =>{
		if(type=="rotate") return cropperRef.value.rotateRight();
		if(type=="zoomin") return cropperRef.value.changeScale();
		if(type=="zoomout") return cropperRef.value.changeScale(-1);
		
		if(type=='auto'){
			options.value.fixed = false;
		}
		if(type=='1/1'){
			options.value.fixed = true;
			options.value.fixedNumber = [1,1];
		}
		if(type=='9/16'){
			options.value.fixed = true;
			options.value.fixedNumber = [9,16];
		}
		if(type=='9/20'){
			options.value.fixed = true;
			options.value.fixedNumber = [9,20];
		}
		nextTick(()=>{
			cropperRef.value.goAutoCrop();
		})
		
	};
	
	
	return{
		options,
		fnConfig,
		editImg
	}
}