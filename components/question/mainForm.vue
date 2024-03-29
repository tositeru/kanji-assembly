<template lang="pug">
  div()
    v-layout(v-bind="getDescriptionLayoutAttributes")
      v-flex(class="text-xs-center description") {{ question.description }}
      v-flex()
        v-btn(class="hint-button" @click="goToHint()") 助言
    v-sheet(color="grey lighten-3" height="50vh" style="overflow:scroll;")
      v-layout(class="strokes" align-center justify-space-around row fill-height wrap)
        div(v-for="(line, i) in question.lines" :key="i" class="stroke elevation-2" :style="`background-image: url(${getStrokeImage(line.kind)});`")
          | x{{line.count}}
    div(class="text-xs-center") (正解と異なる漢字を組み立てられたときは連絡いただけると助かります。Email: kanji.assembly@gmail.com)
    v-layout(column align-center)
        v-flex(grow)
            v-text-field(v-model="answer" :rules="answerRules" :counter="1" required label="回答" reverse class="text-xs-right")
        v-flex(grow)
          div(v-if="question.corrected") 正解済み
            v-icon() check_circle
          v-btn(v-else class="btn-answer" @click="showSendDialog()" :disabled="!validAnswer") 送信
          v-dialog(v-model="doShowSendDialog" width="500")
            v-card
              v-card-title(class="headline grey lighten-2" primary-title) 回答を送信
              v-card-text(class="display-4 text-xs-center") {{ answer }}
              v-card-text(class="text-xs-center") 入力した漢字を回答として送信しますか？
              v-divider
              v-card-actions
                v-spacer
                v-btn(color="primary" flat @click="sendAnswer()") 送信
                v-btn(color="primary" flat @click="doShowSendDialog = false") 止める
</template>

<script>
import { STATUS } from './common'
import Kanji from '~/kanji/kanji.js'

export default {
  data() {
    return {
      doShowSendDialog: false,
      answer: '',
      answerRules: [v => v.length === 1 || '1文字だけ入力してください']
    }
  },
  computed: {
    validAnswer() {
      // 漢字文字の判定も行っている。
      return (
        this.answer.length === 1 &&
        /^[\u2e80-\u2fd5\u3192-\u319f\u3400-\u9fea\uf900-\ufa6d]$/.test(
          this.answer
        )
      )
    },
    question() {
      return this.$store.state.question.currentQuestion
    },
    getDescriptionLayoutAttributes() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return {
            'justify-space-between': true,
            'align-space-around': true,
            column: true
          }
        default:
          return {
            'justify-space-between': true
          }
      }
    }
  },
  created() {
    this.answer = this.$store.state.question.answers[0] || ''
  },
  methods: {
    goToHint() {
      this.$emit('change-status', STATUS.HINT)
    },
    sendAnswer() {
      this.$store.commit('question/setAnswers', [this.answer])
      this.$emit('change-status', STATUS.JUDGING)
    },
    showSendDialog() {
      this.doShowSendDialog =
        this.answerRules.filter(rule => rule(this.answer) !== true).length <= 0
    },
    getStrokeImage(strokeIndex) {
      const stroke = Kanji.getStrokeImage(strokeIndex)
      return stroke
    }
  }
}
</script>

<style lang="scss" scoped>
$breakpoint-xs: 600px;

/* $break-point以下の時に@contentを適用 */
@mixin max-screen($break-point) {
  @media screen and (max-width: $break-point) {
    @content;
  }
}

.hint-button {
  border-radius: 45%;
  float: right;
}

.strokes {
  width: 100%;
  height: 100%;
}
.stroke {
  width: 120px;
  height: 120px;
  background-size: cover;
  text-align: right;
  vertical-align: bottom;

  @include max-screen($breakpoint-xs) {
    width: 70px;
    height: 70px;
  }
}

.description {
  white-space: pre-line;
}

.btn-answer {
  width: 100%;
}
</style>
