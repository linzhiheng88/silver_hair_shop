import Vue from 'vue';
import WindowLayerComponent from './WindowLayer.vue';
import ModalLayerComponent from './ModalLayer.vue';

const WindowLayer = {};

WindowLayer.zorder = 510;
WindowLayer.lockCount = 0;

WindowLayer.open = (params) => {
    // console.log('open')
    // document.body.appendChild(windowLayerComponent)

    let ModalLayerComponentClass = Vue.extend(ModalLayerComponent);
    let instance1;
    const initInstance1 = () => {
        instance1 = new ModalLayerComponentClass({
            el: document.createElement('div')
        });

        instance1.callback = () => {
            // console.log('callback.....');
            instance1.visible = false;
        };
    };
    initInstance1();
    document.body.appendChild(instance1.$el);
    WindowLayer.lockCount++;

    let WindowLayerComponentClass = Vue.extend(WindowLayerComponent);
    let instance;
    let zorder = ++WindowLayer.zorder;
    const initInstance = () => {
        instance = new WindowLayerComponentClass({
            el: document.createElement('div'),
            propsData: {
                ...params,
                zorder,
                mask: instance1.$el
            }
        });
        // console.log('123');
        // instance.mask = instance1.$el;

        instance.callback = () => {
            // console.log('callback.....');
            instance.visible = false;
            document.body.removeChild(instance1.$el);
            WindowLayer.lockCount--;
            if (WindowLayer.lockCount <= 0) {
                document.body.style.overflow = 'auto';
            }
        };

        instance.onBringToTop = () => {
            // console.log('to top', instance.$el.style.zIndex, WindowLayer.zorder);
            if (instance.$el.style.zIndex < WindowLayer.zorder) {
                instance.$el.style.zIndex = ++WindowLayer.zorder;
            }
        };

        instance.$el.style.zIndex = zorder;
    };
    initInstance();
    document.body.appendChild(instance.$el);

    // document.body.appendChild(new cc({el: document.createElement('div')}).el)
    // console.log(cc)
    // console.log(new cc({
    //   el: document.createElement('div')
    // }))
};

export default WindowLayer;
