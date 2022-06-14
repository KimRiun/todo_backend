const express = require('express');
const router = express.Router();

console.log("todo/index.js");

// 할 일
router.get('/', require("./todoGET")); // 조회
router.post('/', require("./todoPOST")); // 생성
router.patch('/:todoId', require("./todoPATCH")); // 수정
router.delete('/:todoId', require("./todoDELETE")); // 삭제

router.patch('/:todoId/complete', require("./todoComletePATCH")); // 완료 체크

// 태그
router.get('/tag', require("./tagGET")); // 조회
// router.post('/:todoId/tag', require("./todoTagMultiPOST")); // 특정 할 일에 태그 여러개를 한 번에 추가 (할 일 수정처럼 보임)
router.post('/:todoId/tag', require("./todoTagPOST")); // 특정 할 일에 태그를 하나씩 추가 (할 일 수정처럼 보임)
router.delete('/:todoId/tag', require("./todoTagDELETE")); // 특정 할 일에 태그 하나씩 삭제 (할 일 수정처럼 보임)
router.post('/tag', require("./tagPOST")); // 태그 테이블에서만 생성
router.delete('/tag/:tagId', require("./tagDELETE")); // 태그 테이블에서만 삭제


module.exports = router;