<template>
    <section class="chapter-content">
        <Backbar></Backbar>
        <section class="chapter">
            <div class="chapter-head" v-show="isTitleShow">
                <span @click="getSources">换源</span>
                <span>目录</span>
                <span @click="reverse">倒序查看</span>
            </div>
            <div class="source-detail" v-show="isSettingShow" v-for="(source,index) in sources" :key="source._id" @click="changeSource(source._id,index)">
              <span>{{ source.name }}</span>
              <span>最后跟新{{ source.lastChapter }}&nbsp;</span>
            </div>
            <div class="chapter-detail" v-show="isChapterShow" v-for="(chapter,index) in chapters" :key="chapter._id" @click="readCurrentChapter(chapter,index)">
                <span :id='"s"+index'>{{ chapter.title }}</span>
                <img src="../../assets/icon/lock.png" alt="" v-if="chapter.isVip">
            </div>
        </section>
        <Popup v-show="options.isPopupShow" @determine="determine" @hidePopup="hidePopup" :options="options"></Popup>
        <Loading v-show="isLoadingShow" style="width:100%; margin: 50px 0 0 0"></Loading>
    </section>
</template>

<script>
import Backbar from '../Backbar/Backbar';
import Popup from '../Popup/Popup';
import Loading from '../Load/Load';
import util from '../../util/util';
import api from '../../api/api';

import {mapMutations} from 'vuex';

export default {
    name: 'chapter',
    data() {
        return {
            chapters: [],
            sources: [],
            options: {
                title: '当前章节只限会员才能观看哟~╰(￣▽￣)╮',
                isPopupShow: false,
                determine: 'determine',
                cancel: 'hidePopup'
            },
            sourceId: 0,
            isTitleShow: false,
            isLoadingShow: true,
            isChapterShow: true,
            isSettingShow: false
        };
    },
    created() {
        this.SET_HEADTITLE(this.$route.query.title);
        this.getChapters();
    },
    mounted() {
      let chapterCount = util.getStore1('BOOKSOURCE:' + this.sourceId);
      console.log('sourceId:' + this.sourceId + '  chapterCount:' + chapterCount);
      if (chapterCount === null) {
        chapterCount = 0;
      }
      setTimeout(() => {
        let jump = document.querySelectorAll('.chapter-detail');
        // 获取需要滚动的距离
        let total = jump[chapterCount].offsetTop - 41;
        jump[chapterCount].setAttribute('style', 'background-color:rgba(237,66,75,0.2);color:#a58d5e');
        let distance = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        // 平滑滚动，时长500ms，每10ms一跳，共50跳
        let step = total / 20;

        if (total > distance) {
          smoothDown();
        } else {
          let newTotal = distance - total;
          step = newTotal / 20;
          smoothUp();
        }
        function smoothDown () {
         if (distance < total) {
           distance += step;
           document.body.scrollTop = distance;
           document.documentElement.scrollTop = distance;
           window.pageYOffset = distance;
           setTimeout(smoothDown, 10);
         } else {
           document.body.scrollTop = total;
           document.documentElement.scrollTop = total;
           window.pageYOffset = total;
         }
        }
        function smoothUp () {
          if (distance > total) {
          distance -= step;
          document.body.scrollTop = distance;
          document.documentElement.scrollTop = distance;
          window.pageYOffset = distance;
          setTimeout(smoothUp, 10);
        } else {
          document.body.scrollTop = total;
          document.documentElement.scrollTop = total;
          window.pageYOffset = total;
        }
      }
    }, 1200);
    },
    methods: {
        ...mapMutations([
            'SET_HEADTITLE'
        ]),
        getChapters: function() {
            console.log('getChapters start');
            let sourceId = util.getStore1('BOOKSOURCE:' + this.$route.query.id);
            if (sourceId === null) {
                sourceId = 0;
            } else {
                this.sourceId = sourceId;
            }
            console.log('sourceid' + sourceId);
            api.getChapters(this.$route.query.id, sourceId)
                .then(data => {
                    this.sources = data[0];
                    this.chapters = data[1];
                    console.log(data);
                    if (sourceId === 0) {
                        sourceId = data[0][0]._id;
                        console.log('getChapters | sourceId:' + sourceId);
                        this.sourceId = sourceId;
                        util.setStore('BOOKSOURCE:' + this.$route.query.id, sourceId);
                    }

                    this.$nextTick(() => {
                        this.isLoadingShow = !this.isLoadingShow;
                        this.isTitleShow = !this.isTitleShow;
                    });
                });
        },
        reverse() {
            this.chapters = this.chapters.reverse();
        },
        getSources() {
            this.isSettingShow = !this.isSettingShow;
            this.isChapterShow = !this.isChapterShow;
        },
        changeSource(sourceId, index) {
          console.log(sourceId);
          this.isLoadingShow = !this.isLoadingShow;
          api.getChapters1(sourceId)
            .then(data => {
                console.log(data);
                this.chapters = data;
                this.isSettingShow = false;
                this.isChapterShow = true;
                this.sourceId = sourceId;
                util.setStore('BOOKSOURCE:' + this.$route.query.id, sourceId);
              });
        },
        readCurrentChapter(chapter, index) {
            if (chapter.isVip) {
                this.options.isPopupShow = true;
            } else {
                util.setStore('BOOKSOURCE:' + this.sourceId, index);
                this.$router.push({ path: '/read', query: { chapter: chapter, chapters: this.chapters, chapterIndex: index, sourceId: this.sourceId } });
            }
        },
        determine() {
            this.hidePopup();
        },
        hidePopup() {
            this.options.isPopupShow = false;
        }
    },
    components: {
        'Backbar': Backbar,
        'Popup': Popup,
        'Loading': Loading
    }
};
</script>

<style lang="scss">
@import './Chapter.scss';
</style>
