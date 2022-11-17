<template>
    <div class="modal-layer">
    </div>
</template>

<script>
    export default {
        name: 'modal-layer',
        data () {
            return {
                msg: 'Welcome to Your Vue.js App'
            };
        },
        mounted: function () {
            document.body.style.overflow = 'hidden';
        },
        destroyed: function () {
            document.body.style.overflow = 'auto';
        }
    };
</script>

<style scoped>
    .modal-layer {
        background: #000;
        opacity: .3;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        z-index: 500;
        /*pointer-events: none;*/
    }
</style>
