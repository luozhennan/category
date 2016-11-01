(function (window) {
    window.onload= function () {
        var box=document.getElementById('category_left');//
        var boxHeight=box.offsetHeight;//可视盒子的高度
        var ulBox=box.getElementsByTagName('ul')[0];
        var ulHeight=ulBox.offsetHeight;//滑动盒子的高度
        var maxP=0;//最大y坐标
        var minP=boxHeight-ulHeight;//最小y坐标
        var maxBounce=maxP+100;//最大弹簧y坐标
        var minBounce=minP-100;//最小弹簧y坐标
        
        var addTransition= function () {//设置过渡
            ulBox.style.webkitTransition='all .2s';
            ulBox.style.transition='all .2s'
        }

        var setTransform= function (distance) {//设置偏移
            ulBox.style.webkitTransform='translateY('+distance+'px)';
            ulBox.style.transform='translateY('+distance+'px)';
        }

        var startY=0;//开始的y坐标
        var moveY=0;//移动时的y坐标
        var distance=0;//移动的距离
        var currentY=0;//当前的y坐标

        //监听滑动的盒子
        ulBox.addEventListener('touchstart', function (e) {
            startY= e.touches[0].clientY;
        });

        ulBox.addEventListener('touchmove', function (e) {
            moveY= e.touches[0].clientY;
            distance=moveY-startY;
            //判断是否超出最大和最小移动范围
            if(distance+currentY>maxBounce||distance+currentY<minBounce){
                console.log('不能再移动了');
                return;
            }
            setTransform(distance+currentY);//移动的时候设置偏移
        });

        ulBox.addEventListener('touchend', function (e) {
            if(distance+currentY>maxP){//判断是否在maxBounceY区间
                currentY=maxP;//重置currentY
                addTransition();
                setTransform(currentY);
            }else if(distance+currentY<minP){//判断是否在minBounceY区间
                currentY=minP//重置currentY
                addTransition();
                setTransform(currentY)
            }else{
                currentY+=distance;
            }
        });

        //因为移动端click有300ms延迟
        //所以封装tap敲击事件
        function tap(obj,callback) {
            var isMove=false;//是否移动过
            var startTime=0;//开启响应时间
            if(obj&&typeof obj==='object'){
                obj.addEventListener('touchstart', function () {
                    startTime=Date.now();//Date.now()可以获取当前系统时间，但是是以ms做为单位
                });
                obj.addEventListener('touchmove', function () {
                    isMove=true;
                });
                obj.addEventListener('touchend', function (e) {
                    if(isMove==false && Date.now()-startTime<150){//判断是否是单击事件
                        callback&&callback(e);
                    }else{
                        isMove=false;//重置isMove
                    }
                });
            }
        }

        var lis=ulBox.getElementsByTagName('li');
        var liHeight=lis[0].offsetHeight;
        tap(ulBox, function (e) {
            var currentLi= e.target.parentNode;
            for (var i = 0; i < lis.length; i++) {
                lis[i].className='';
                lis[i].index=i;
            }
            currentLi.className='active';
            var index=currentLi.index;
            if(-index*liHeight<minP){
                currentY=minP;
                addTransition();
                setTransform(currentY);
            }else{
                currentY=-index*liHeight;
                addTransition();
                setTransform(currentY);
            }
        })
    }

})(window);