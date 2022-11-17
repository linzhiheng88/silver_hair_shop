<template>
    <div class="resizeable-panel" ref="panel"
         @mouseleave="mouseleave"
         @mousemove="mousemove"
         @mousedown="mousedown"
    >
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: ['outmousedown', 'mask'],
        name: 'resizeable-panel',
        data () {
            return {
                //        msg: 'Welcome to Your Vue.js App'
                horizontal: 0,
                vertical: 0
            };
        },
        methods: {
            max () {
                if (this.$refs.panel.style.height !== '100%' || this.$refs.panel.style.width !== '100%') {
                    this.preLeft = this.$refs.panel.style.left;
                    this.preTop = this.$refs.panel.style.top;
                    this.preHeight = this.$refs.panel.style.height;
                    this.preWidth = this.$refs.panel.style.width;

                    this.$refs.panel.style.left = '0px';
                    this.$refs.panel.style.top = '0px';
                    this.$refs.panel.style.height = '100%';
                    this.$refs.panel.style.width = '100%';
                } else {
                    this.$refs.panel.style.left = this.preLeft;
                    this.$refs.panel.style.top = this.preTop;
                    this.$refs.panel.style.height = this.preHeight;
                    this.$refs.panel.style.width = this.preWidth;
                }
            },
            mouseleave () {
                // console.log('mouseleave');
                if (this.dragging) return;
                document.body.style.cursor = 'auto';
            },
            mousemove (event) {
                if (this.dragging) return;
                this.startWidth = this.$refs.panel.offsetWidth;
                this.startX = event.clientX;
                this.startLeft = this.$refs.panel.offsetLeft;
                this.startHeight = this.$refs.panel.offsetHeight;
                this.startY = event.clientY;
                this.startTop = this.$refs.panel.offsetTop;

                //        console.log(this.startLeft)

                this.horizontal = 0;
                this.vertical = 0;
                let horizontalCursor = '';
                let verticalCursor = '';

                if (this.startX - this.startLeft <= 5) {
                    this.horizontal = -1;
                    horizontalCursor = 'w';
                }
                if (this.startX - this.startLeft - this.startWidth >= -5) {
                    this.horizontal = 1;
                    horizontalCursor = 'e';
                }
                if (this.startY - this.startTop <= 5) {
                    this.vertical = -1;
                    verticalCursor = 'n';
                }
                if (this.startY - this.startTop - this.startHeight >= -5) {
                    this.vertical = 1;
                    verticalCursor = 's';
                }

                if (horizontalCursor.length === 0 && verticalCursor.length === 0) {
                    document.body.style.cursor = 'auto';
                } else {
                    document.body.style.cursor = (verticalCursor + horizontalCursor) + '-resize';
                }
                //        console.log(document.body.style.cursor)
            },
            mousedown (event) {
                this.outmousedown();
                // console.log('mousedown');
                if (this.horizontal === 0 && this.vertical === 0) {
                    return;
                }

                this.$refs.panel.style.right = 'auto';
                this.$refs.panel.style.bottom = 'auto';
                this.$refs.panel.style.left = (this.startLeft) + 'px';
                this.$refs.panel.style.top = (this.startTop) + 'px';

                document.onmousemove = eMove.bind(this);
                document.onmouseup = undrag.bind(this);
                this.dragging = true;

                //        let borderSize = 5 * 2;
                let borderSize = 0;

                let xOffset = event.clientX - this.startLeft;
                let xOffset2 = this.startLeft + this.startWidth - event.clientX;
                let yOffset = event.clientY - this.startTop;
                let yOffset2 = this.startTop + this.startHeight - event.clientY;

                //        let parentElement = this.$refs.panel.parentElement;
                //        console.log('mask',this.mask)
                let parentElement = this.mask;
                let parentWidth, parentHeight;
                if (parentElement) {
                    parentWidth = parentElement.clientWidth;
                    parentHeight = parentElement.clientHeight;
                }

                document.onselectstart = () => {
                    return !this.dragging;
                };

                function eMove (event) {
                    //          console.log(xOffset2)
                    let x = event.clientX;
                    if (this.horizontal < 0) {
                        x = x - xOffset < borderSize ? borderSize + xOffset : x;
                    } else {
                        x = x + xOffset2 > parentWidth - borderSize ? parentWidth - (xOffset2) - borderSize : x;
                    }
                    let dx = x - this.startX;
                    let y = event.clientY;
                    if (this.vertical < 0) {
                        y = y - yOffset < borderSize ? borderSize + yOffset : y;
                    } else {
                        y = y + yOffset2 > parentHeight - borderSize ? parentHeight - (yOffset2) - borderSize : y;
                    }
                    let dy = y - this.startY;

                    if (dx && this.horizontal < 0) {
                        let preWidth = this.$refs.panel.clientWidth;
                        this.$refs.panel.style.width = (this.startWidth - dx) + 'px';
                        let newWidth = this.$refs.panel.clientWidth;
                        if (preWidth !== newWidth) {
                            this.$refs.panel.style.left = (this.startLeft + (this.startWidth - newWidth)) + 'px';
                        }
                    }
                    if (dx && this.horizontal > 0) {
                        this.$refs.panel.style.width = (this.startWidth + dx) + 'px';
                    }

                    if (dy && this.vertical < 0) {
                        let preHeight = this.$refs.panel.clientHeight;
                        this.$refs.panel.style.height = (this.startHeight - dy) + 'px';
                        let newHeight = this.$refs.panel.clientHeight;
                        if (preHeight !== newHeight) {
                            this.$refs.panel.style.top = (this.startTop + (this.startHeight - newHeight)) + 'px';
                        }
                    }

                    if (dx && this.vertical > 0) {
                        this.$refs.panel.style.height = (this.startHeight + dy) + 'px';
                    }
                }

                function undrag () {
                    this.dragging = false;
                    document.onmousemove = null;
                    this.horizontal = 0;
                    this.vertical = 0;
                }
            }
        },
        mounted: function () {
            //      document.onselectstart=()=>{return !this.dragging}
        },
        beforeDestroy: function () {
        }
    };
</script>

<style scoped>
    .resizeable-panel {
        /*width: 500px;*/
    }


</style>
