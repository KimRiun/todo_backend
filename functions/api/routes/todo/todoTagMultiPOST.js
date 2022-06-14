// 할 일에 태그 추가
const Sequelize = require('sequelize');
const Todo = require('../../../models/todo');
const Tag = require('../../../models/tag');
const db = require('../../../models');

// 해당 할 일에 등록된 모든 태그를 "배열"로 받음 (태그 여러개)
module.exports = async (req, res) => {
    const {todoId} = req.params; // todo id
    const {tags} = req.body; // 해당 할 일에 등록된 모든 태그를 "배열"로 받음 (태그 여러개)
    
    console.log("~~~~~~~~~~~~~~~~~~request body: 태그 배열");
    console.log("tags:", tags);

    // 색상 배열
    const colors = ['red', 'green', 'blue', 'white', 'black'];
    let tag, new_tag, todo, connected_todo;

    // 할 일에 태그 생성 및 등록
    try {
        // id가 존재하는지 검사
        const valid = await Todo.findOne({
            where : { id: todoId }
        })

        if (!valid) {
            return res.status(400).json(
            {
                message: "존재하지 않는 id 입니다",
            });
        }

        // 일반 삭제된 할 일인지 검사
        if(valid.is_deleted === true) {
            return res.status(400).json(
            {
                message: "일반 삭제된 할 일 입니다",
            });
        }
        

        // 해당 할 일에 태그 하나씩 추가
        for(let i=0; i < tags.length; i++) {
            console.log("~~현재 태그:", tags[i]);

            // 태그 id 찾기
            tag = await Tag.findOne({
                where: {tag_name : tags[i] }
            })
            // console.log("tag.id:", tag.id);

            // 처음 등장하는 태그라면
            if(!tag){
                console.log("처음 등장하는 태그라면");

                // 서로 다른 2가지 랜덤 색상 뽑기
                let font_color = Math.floor(Math.random() * (colors.length-1));
                let bg_color = Math.floor(Math.random() * (colors.length-1));
                while(font_color === bg_color) {
                    bg_color = Math.floor(Math.random() * (colors.length-1));
                }

                // 태그 테이블에 삽입
                new_tag = await Tag.create({
                    tag_name: tags[i],
                    font_color: colors[font_color],
                    bg_color: colors[bg_color]
                })
            }
            else {
                // 할일-태그 테이블에 있는지 조사
                connected_todo = await db.sequelize.models.todo_tag.findOne({
                    attributes: ['ToDoId'],
                    where: {TagId : tag.id, ToDoId: todoId }
                })
                console.log("연결된 할일-태그", todo);

                // 이미 연결되어 있는 태그라면(할일-태그 테이블에 있다면)
                if(connected_todo) {
                    console.log("연결된 할 일이 있으므로 continue");
                    continue;
                }

            }

            // 연결은 안되어 있지만, 태그 테이블에 존재하는 태그의 경우
            // 할일-태그 테이블에 추가
            console.log("연결은 안되어 있지만, 태그 테이블에 존재하는 태그");
            if(tag) {
                db.sequelize.models.todo_tag.create({
                    ToDoId: todoId,
                    TagId: tag.id
                })
            }
            else{
                db.sequelize.models.todo_tag.create({
                    ToDoId: todoId,
                    TagId: new_tag.id
                })
            }

            // tag, new_tag, todo 초기화
            tag = null;
            new_tag = null;
            todo = null;
            
        }
        
        // 할 일 수정날짜 변경
        todo = await Todo.update({
            updated_at: Sequelize.fn('NOW'),
        }, {
            where: {id: todoId},
        });
        todo = await Todo.findOne({
            attributes : ['updated_at'],
            where: {id: todoId},
        });

        console.log("~~todo", todo);

        res.status(200).json(
            {
                updated_at: todo.updated_at,
                tags: tags,
                message: "태그 추가 성공",
            }
        );
    }
    catch(err) {
        res.status(400).json(
            {
                message: "태그 추가 실패",
            }
        );
        console.error("태그 추가 실패", err);
    }

};