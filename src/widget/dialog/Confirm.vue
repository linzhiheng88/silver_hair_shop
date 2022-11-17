<template>
    <div class="container">
<!--        {{message}}-->
      <div v-html="message"></div>
    </div>
</template>

<script>
    export default {
        name: 'Confirm',
        props: ['extra'],
        computed: {
            message: function () {
                return (this.extra && this.extra.message) || '无消息';
            }
        }
    };
</script>

<style scoped>

    .container {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        line-height: 24px;
        padding: 20px;
        overflow-x: hidden;
        overflow-y: auto;
        font-size: 14px;
        color: rgb(102, 102, 102)
    }
</style>
