<template>
    <!--<div class="window-layer" ref="wrapper">-->
    <!--<div id="main" class="block"></div>-->
    <div ref="winbody" class="winbody" :outmousedown="mousedown" :mask="mask" :style="windowStyle"
         :is="resizable?ResizeablePanel:'div'">
        <div class="winbody_border">
            <div class="title_div" @dblclick="max">
                <span class="title-label">{{title||'提示'}}</span>
                <span class="title_handler_bar" ref="wintitle"></span>
                <div class="oper-span">
                    <div class="oper" @click="max" v-if="resizable">
                        <img class="max"
                             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAoklEQVRIS2NkGCDAOED2MgwaiwUYGBj0aRQKFxkYGD7AzEb3sQMDA8N+GlnsyMDAcGBQW3wQ2YVkhgIoBO2heon2cSMDA0MDmRbCtIH0149aDAoBfKl6NKjJSWejiYuokms0cY0mLmJCYDQ7De7sBHId3IXERCgWNaCGAAiDANENATLtwqltcFoMat4aUNurUPMu4Gve0shOTGMHTU+Cbj4GAPylVB/IKuZQAAAAAElFTkSuQmCC"/>
                    </div>
                    <div class="oper" @click="close">
                        <img class="close"
                             src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAABLElEQVRIS8XW4RHCMAgF4NcN3ETdQCfSUXQiHcFu4gZ6eOLRCAmQ3NWfteaTQl8yYaXPtJILCV8AnAA8ABwBPAf9qQ2AG4AdgCuAM60r4ZeARuES5eU/poQJ2w7ENXT+Vr6A6cb7INxCD9zCcrhG4E20fNT8lHtwF2rBdD2Du9EaHMVDaAv24mHUA7dw+p7DgWeEXpnf9Foh5I1Mq+e0LiVSCPVWXJt2WZCr0kV8BTJZq5x+HkKjFXO/y57S9XC2e3tcQ/mBhXAvbL0yhKY2Fg9ce08JTm0sLdgTDpl4XWyL5XB70PTGYlUcQVO4BmfQMK4dBFLZK/rk6rmEeyrV5qM67bXDXjgGC92qfF9Gpjze9qK1nv8db/lAPwrVcPVAH9ik+m9tJVe/YKzwBq7zgh8lnakFAAAAAElFTkSuQmCC"/>
                    </div>
                </div>
            </div>
            <div class="window-container" :style="hasButtonBar?'bottom:47px':''">
                <div :is="component" :extra="extra" :$store="store" :$router="router" @close="close" ref="dialog"></div>

            </div>
            <div v-if="hasButtonBar" class="button-bar">
                <Button :type="index>0?'default':'primary'" size="small" class="button" @click="onBtnClick(index)"
                        :loading="btnLoadingMap[index]"
                        :disabled="btnDisabledMap[index]"
                        :key="index"
                        v-for="(item,index) in btn">
                    {{item}}
                </Button>
            </div>
        </div>
    </div>
    <!--</div>-->
</template>

<script>
    import ResizeablePanel from './ResizeablePanel.vue';

    export default {
        components: {
            ResizeablePanel
        },
        name: 'window-layer',
        props: [
            'mask',
            'zorder',
            'title',
            'component',
            'extra',
            'btn',
            'width',
            'height',
            'resizable',
            'onDismiss',
            'onBtn',
            'store',
            'router'
        ],
        data () {
            return {
                ResizeablePanel,
                btnLoadingMap: this.buildBtnState(),
                btnDisabledMap: this.buildBtnState()
                // title: '窗口标题',
                // mask: null
            };
        },
        computed: {
            hasButtonBar: function () {
                return (this.btn && this.btn.length > 0);
            },
            windowStyle: function () {
                // return `z-index: ${this.zorder};height:${this.height || 154}px;width:${this.width || 260}px;min-height:${this.height || 154}px;min-width:${this.width || 260}px;`;
                return `z-index: ${this.zorder};height:${this.height || 154}px;width:${this.width || 260}px;min-width:${this.width || 260}px;`;
            }
        },
        mounted: function () {
            // console.log('ccc', this.comp, this.extra);
            let winbody = this.$refs.winbody.$el || this.$refs.winbody;
            let wintitle = this.$refs.wintitle;
            this.bindDrag(wintitle, winbody);
        },
        updated () {
            //      if (!this.initLayout) {
            //        this.$el.style.left = (this.mask.offsetWidth / 2 - this.$el.offsetWidth / 2) + "px"
            //        this.$el.style.top = (this.mask.offsetHeight / 2 - this.$el.offsetHeight / 2) + "px"
            //        this.initLayout = true;
            //      }
        },
        methods: {
            buildBtnState: function () {
                if (!this.btn) return {};
                let t = {};
                this.btn.forEach((item, index) => {
                    t[index] = false;
                });
                return t;
            },
            onBtnLoadingStart (index) {
                this.btnLoadingMap[index] = true;
                for (let key in this.btnDisabledMap) {
                    if (this.btnDisabledMap.hasOwnProperty(key) && key !== '' + index) {
                        // console.log(key, index, typeof key, typeof index);
                        this.btnDisabledMap[key] = true;
                    }
                }
            },
            onBtnLoadingStop (index) {
                this.btnLoadingMap[index] = false;
                for (let key in this.btnDisabledMap) {
                    if (this.btnDisabledMap.hasOwnProperty(key) && key !== '' + index) {
                        this.btnDisabledMap[key] = false;
                    }
                }
            },
            onBtnClick: async function (index) {
                this.onBtnLoadingStart(index);
                // console.log(this.$refs.dialog);
                let result = true;
                if (this.onBtn) {
                    result = await this.onBtn(index);
                }
                if (this.$refs.dialog.onBtn) {
                    result = result && await this.$refs.dialog.onBtn(index);
                }
                // console.log('btn result', result);
                this.onBtnLoadingStop(index);
                if (result) {
                    this.onDismiss && this.onDismiss(index, result);
                    this.close();
                }
            },
            mousedown () {
                // console.log('11111111111');
                this.onBringToTop();
            },
            max () {
                this.$refs.winbody.max();
            },
            close () {
                // console.log(22);
                // console.log('close');
                this.$destroy();
                document.body.removeChild(this.$el);
                this.callback();
            },
            bindDrag (title, body, range2) {
                let w = window;
                let win = body || title;
                let x, y, _left, _top;

                let range = (x, type) => {
                    let wrapper = this.mask;
                    let winbody = this.$refs.winbody.$el || this.$refs.winbody;
                    let max = {
                        x: wrapper.offsetWidth - winbody.offsetWidth,
                        y: wrapper.offsetHeight - winbody.offsetHeight
                    };
                    return Math.max(0, Math.min(max[type], x));
                };
                title.style.cursor = 'move';
                title.onmousedown = function (e) {
                    // console.log('window title down');
                    e = e || event;
                    x = e.clientX;
                    y = e.clientY;
                    _left = win.offsetLeft;
                    _top = win.offsetTop;
                    this.ondragstart = function () {
                        return false;
                    };
                    document.onmousemove = eMove;
                    document.onmouseup = undrag;
                };

                function eMove (e) {
                    win.style.right = 'auto';
                    win.style.bottom = 'auto';
                    e = e || event;
                    let cl = range(_left + e.clientX - x, 'x');
                    let ct = range(_top + e.clientY - y, 'y');
                    win.style.left = cl + 'px';
                    win.style.top = ct + 'px';
                    w.getSelection ? w.getSelection().removeAllRanges()
                        : document.selection.empty();
                };

                function undrag () {
                    this.onmousemove = null;
                };
            },
            $ (x) {
                return typeof x === 'string' ? document.getElementById(x) : x;
            }
        }
    };
</script>

<style scoped>
    .window-layer {
        /*background: #fbd0d3;*/
        /*opacity: .5;*/
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        /*display: flex;*/
        /*align-items: center;*/
        /*justify-content: center;*/

    }

    .title_div {
        font-size: 14px;
        /*position: relative;*/
        /*position: absolute;*/
        /*left: 10px;*/
        /*top: 10px;*/
        /*right: 10px;*/
        /*border: 1px solid #000;*/
        /*background: #f00;*/

        height: 37px;
        line-height: 32px;
        text-align: center;
        /*margin-left: 10px;*/
        /*margin-top: 10px;*/
        /*margin-right: 10px;*/

        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;

        display: flex;
        flex-direction: row;
        color: #333;
    }

    .title-label {
        align-self: left;
        margin-left: 15px;
    }

    .title_handler_bar {
        /*background: rgba(255, 70, 94, 0.15);*/
        position: absolute;
        left: 5px;
        right: 5px;
        top: 5px;
        height: 37px;
    }

    .winbody {
        position: fixed;
        margin: auto;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        /*left: 0px;*/
        /*top: 0px;*/
        /*left: 0;*/
        /*top: 200px;*/
        /*border: 1px solid #e2e2e2;*/
        min-width: 260px;
        min-height: 154px;
         max-height: 95%;

        display: flex;
        flex-direction: column;

        height: 300px;
        width: 500px;

        background: rgb(248, 248, 248);
        /*padding: 5px;*/

        /*box-shadow: 0px 20px 100px 5px rgba(0, 0, 0, 0.04);*/
        /*box-shadow: 0 5px 15px rgba(0, 0, 0, .5);;*/
        /*box-shadow: 0 2px 15px rgba(0, 0, 0, .5);;*/
        /*border-radius: 5px;*/

        /*border: 1px solid rgba(0,0,0,.1);*/
        /*box-shadow: 1px 1px 5px rgba(0, 0, 0, .2);*/
        box-shadow: 1px 1px 50px rgba(0, 0, 0, .3);
        border-radius: 2px;
    }

    .winbody_border {
        padding: 5px;
        display: flex;
        flex-direction: column;
        flex: 1;

        /*border: 1px solid rgba(0, 0, 0, .1);*/

        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }

    .window-container {
        overflow: auto;
        background: #FFF;

        /*-webkit-touch-callout: none;*/
        /*-webkit-user-select: none;*/
        /*-khtml-user-select: none;*/
        /*-moz-user-select: none;*/
        /*-ms-user-select: none;*/
        /*user-select: none;*/

        flex: 1;
        border: 1px solid #e2e2e2;
        border-width: 0;
        border-top-width: 1px;
        border-color: rgb(238, 238, 238);

        position: absolute;
        left: 0px;
        right: 0px;
        bottom: 0px;
        top: 41px;
    }

    .oper-span {
        position: absolute;
        right: 5px;
        top: 9px;
        height: 25px;
        cursor: pointer;
        line-height: 25px;
        text-align: center;
        display: flex;
    }

    .oper {
        position: relative;
        height: 25px;
        width: 30px;
    }

    .close-span {
        position: absolute;
        right: 5px;
        top: 5px;
        height: 25px;
        width: 30px;
        cursor: pointer;
        line-height: 25px;
        text-align: center;
    }

    .oper {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .oper img {
        width: 12px;
        height: 12px
    }

    .oper img.max {
        width: 14px;
        height: 14px;
    }

    .oper:hover {
        background: #d6d6d6;
    }

    /*#google{width:300px;height:300px;border:2px inset #fff;background:#fff;position:relative;overflow:hidden;}*/

    .button-bar {
        /*background: #f28330;*/
        background: white;
        /*border-top: 1px solid #e2e2e2;*/
        height: 47px;
        bottom: 0px;
        left: 0;
        right: 0;
        position: absolute;

        padding-left: 15px;
        padding-right: 15px;
        padding-bottom: 12px;
        /*padding-top: 12px;*/
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: flex-end;
    }

    .button {
        height: 30px;
        line-height: 28px;
        margin-left: 5px;
        margin-right: 5px;
        padding-left: 15px;
        padding-right: 15px;
        padding-top: 0;
        padding-bottom: 0;
    }
</style>
