// 태그 생성
const Sequelize = require('sequelize');
const Todo = require('./../../../models/todo');
const Tag = require('./../../../models/tag');
const db = require('./../../../models');


module.exports = async (req, res) => {    
    const {tag_name} = req.body; // 생성할 태그명

    // 색상 배열
    const colors = ['red', 'green', 'blue', 'white', 'black'];

    // 할 일 생성
    try {

       
        console.log("~~~~~~~~~~~tag_name:", tag_name);
        // 태그명이 비었다면 클라에게 에러 보내기
        if (!tag_name){
            return res.status(400).json(
                {
                    message: "태그명이 비었습니다",
                }
            )
        }
        
        // 중복되는 태그명인지 검사
        const duplicate_tag = await Tag.findOne({
            attributes : ['id'],
            where : {tag_name : tag_name}
        })
        if(duplicate_tag) {
            return res.status(400).json(
                {
                    message: "이미 존재하는 태그입니다",
                }
            )
        }


        // 서로 다른 2가지 랜덤 색상 뽑기
        let font_color = Math.floor(Math.random() * (colors.length-1));
        let bg_color = Math.floor(Math.random() * (colors.length-1));
        while(font_color === bg_color) {
            bg_color = Math.floor(Math.random() * (colors.length-1));
        }

        // 태그 테이블에 삽입
        const new_tag = await Tag.create({
            tag_name: tag_name,
            font_color: colors[font_color],
            bg_color: colors[bg_color]
        })
        
        const tag = await Tag.findOne({
            where: {id: new_tag.id}
        })
    


        res.status(200).json(
            {
                tag: tag,
                message: "태그 생성 성공",
            }
        );
    }
    catch(err) {
        res.status(400).json(
            {
                message: "태그 생성 실패",
            }
        );
        console.error("태그 생성 실패", err);
    }

};