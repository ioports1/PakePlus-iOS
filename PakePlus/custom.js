console.log(
    '%cbuild from PakePlus： https://github.com/Sjj1024/PakePlus',
    'color:orangered;font-weight:bolder'
)

// 权限请求和文件上传解决方案
(function() {
    // 1. 权限请求函数
    const requestPermissions = () => {
        // Android权限请求
        if (window.plus && plus.android) {
            const permissions = [
                "android.permission.CAMERA",
                "android.permission.READ_EXTERNAL_STORAGE",
                "android.permission.WRITE_EXTERNAL_STORAGE"
            ];
            
            plus.android.requestPermissions(
                permissions,
                function(result) {
                    console.log("权限请求结果:", result);
                    if (result.deniedAlways && result.deniedAlways.length > 0) {
                        console.warn("以下权限被永久拒绝:", result.deniedAlways);
                    }
                },
                function(error) {
                    console.error("权限请求失败:", error);
                }
            );
        }
        
        // iOS权限请求
        if (window.plus && plus.ios) {
            try {
                const avCaptureDevice = plus.ios.import("AVCaptureDevice");
                const authStatus = avCaptureDevice.authorizationStatusForMediaType("vide");
                
                if (authStatus !== 3) { // 3 = AVAuthorizationStatusAuthorized
                    avCaptureDevice.requestAccessForMediaTypeCompletionHandler("vide", function(granted) {
                        console.log("相机权限请求结果:", granted);
                    });
                }
                
                // 请求相册权限
                const photoLibrary = plus.ios.import("PHPhotoLibrary");
                photoLibrary.requestAuthorization(function(status) {
                    console.log("相册权限状态:", status);
                });
            } catch (e) {
                console.error("iOS权限请求异常:", e);
            }
        }
    };
    
    // 2. 文件上传解决方案
    const setupFileUpload = () => {
        // 替换所有文件输入框
        document.querySelectorAll('input[type="file"]').forEach(input => {
            const container = document.createElement('div');
            container.style.position = 'relative';
            container.style.marginTop = '8px';
            
            const customButton = document.createElement('button');
            customButton.textContent = '选择文件';
            customButton.style.padding = '8px 16px';
            customButton.style.backgroundColor = '#f0f0f0';
            customButton.style.border = '1px solid #ccc';
            customButton.style.borderRadius = '4px';
            customButton.style.cursor = 'pointer';
            
            // 隐藏原生input
            input.style.position = 'absolute';
            input.style.opacity = '0';
            input.style.width = '100%';
            input.style.height = '100%';
            input.style.top = '0';
            input.style.left = '0';
            input.style.cursor = 'pointer';
            
            // iOS特殊处理
            if (navigator.userAgent.match(/(iPad|iPhone|iPod)/)) {
                input.setAttribute('capture', 'camera');
                input.setAttribute('accept', 'image/*');
            }
            
            container.appendChild(customButton);
            container.appendChild(input);
            
            input.parentNode.insertBefore(container, input);
            input.parentNode.removeChild(input);
            
            // 文件选择处理
            input.addEventListener('change', function(e) {
                if (e.target.files && e.target.files.length > 0) {
                    const file = e.target.files[0];
                    console.log('已选择文件:', file.name);
                    
                    // 验证文件
                    if (!file.type.match('image.*')) {
                        alert('请选择图片文件 (JPG, PNG, GIF)');
                        return;
                    }
                    
                    if (file.size > 5 * 1024 * 1024) {
                        alert('文件大小不能超过5MB');
                        return;
                    }
                    
                    // 这里可以添加文件预览或其他处理
                }
            });
        });
    };
    
    // 3. 初始化函数
    const init = () => {
        // 请求必要权限
        requestPermissions();
        
        // 设置文件上传功能
        setupFileUpload();
        
        // 添加自定义文件上传按钮事件监听
        document.addEventListener('click', function(e) {
            if (e.target.matches('.custom-file-button')) {
                const input = e.target.nextElementSibling;
                if (input && input.tagName === 'INPUT' && input.type === 'file') {
                    input.click();
                }
            }
        });
    };
    
    // 页面加载完成后初始化
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();

// 原始PakePlus代码保持不变
const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )
    console.log('origin', origin, isBaseTargetBlank)
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

window.open = function (url, target, features) {
    console.log('open', url, target, features)
    location.href = url
}

document.addEventListener('click', hookClick, { capture: true })