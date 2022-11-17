import WindowLayer from './WindowLayer';
import Confirm from './Confirm';
import ImageShow from './ImageShow';
import ConfirmPassword from './ConfirmPassword';


function confirm ({...params}) {
    params.btn = params.btn || ['确定', '取消'];
    params.component = params.component || Confirm;
    WindowLayer.open({
        ...params,
        extra: {message: params.message}
    });
}

function imageShow ({...params}) {
  params.btn = [];
  params.component = params.component || ImageShow;
  WindowLayer.open({
    ...params,
    extra: {url: params.extra}
  });
}


function confirmPassword ({...params}) {
  params.btn = params.btn || ['确定', '取消'];
  params.component = params.component || ConfirmPassword;
  WindowLayer.open({
    ...params,
    extra: {message: params.message}
  });
}



const dialog = {
    open: WindowLayer.open,
    imageShow,
    confirm,
    confirmPassword,
};

export default {
    install (Vue) {
        Object.defineProperty(Vue.prototype, '$dialog', {value: dialog});
    }
};
