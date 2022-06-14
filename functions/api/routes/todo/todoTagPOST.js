// 할 일에 태그 추가
const Sequelize = require('sequelize');
const Todo = require('../../../models/todo');
const Tag = require('../../../models/tag');
const db = require('../../../models');

// 추가할 태그명 (태그 1개)
module.exports = async (req, res) => {
    const {todoId} = req.params; // todo id
    const {tag_name} = req.query; // 추가할 태그명 (태그 1개)
    
    console.log("~~~~~~~~~~~~~~~~~~request body: 태그 배열");
    console.log("tag_name:", tag_name);

    // 색상 배열
    const colors = ['red', 'green', 'blue', 'white', 'black'];
    let tag, new_tag, todo, connected_todo, tags;

    // 할 일에 태그 생성 및 등록
    try {
        // 태그명이 비었다면 클라에게 에러 보내기
        if (!tag_name){
            return res.status(400).json(
                {
                    message: "태그명이 비었습니다",
                }
            )
        }

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
        

        // 할 일에 등록되어 있는 태그들
        todo = await Todo.findOne({
            attributes: ['id', 'todo_name'],
            include: {
                attributes: ['id', 'tag_name', 'font_color', 'bg_color'],
                model: Tag,
                through: {attributes: []} // 연결 테이블에서 가져올 컬럼
            },
            where: {id: todoId }
        }); 

        // 해당 할 일에 태그 추가하기
        // 태그 id 찾기 tag.id
        tag = await Tag.findOne({
            where: {tag_name : tag_name }
        })
        // console.log("tag.id:", tag.id);

        // 할일-태그 테이블에 있는지 조사
        if(tag){
            connected_todo = await db.sequelize.models.todo_tag.findOne({
                attributes: ['ToDoId'],
                where: {TagId : tag.id, ToDoId: todoId }
            })
            // console.log(connected_todo);

            // 1. 해당 할 일에 이미 등록된 태그일 경우
            if(connected_todo) {
                console.log("해당 할 일에 이미 등록된 태그");
                return res.status(200).json(
                    {
                        todo: todo,
                        message: "해당 할 일에 이미 등록된 태그입니다",
                    }
                );
            }

        }


        // 2. 처음 등장하는 태그일 경우
        if(!tag){
            console.log("처음 등장하는 태그");

            // 서로 다른 2가지 랜덤 색상 뽑기
            let font_color = Math.floor(Math.random() * (colors.length-1));
            let bg_color = Math.floor(Math.random() * (colors.length-1));
            while(font_color === bg_color) {
                bg_color = Math.floor(Math.random() * (colors.length-1));
            }

            // 태그 테이블에 삽입
            new_tag = await Tag.create({
                tag_name: tag_name,
                font_color: colors[font_color],
                bg_color: colors[bg_color]
            })

            // 할일-태그 테이블에 추가
            db.sequelize.models.todo_tag.create({
                ToDoId: todoId,
                TagId: new_tag.id
            })
        }

        // 3. 등록은 안되어 있지만, 태그 테이블에 존재하는 태그의 경우
        // 할일-태그 테이블에 추가
        console.log("연결은 안되어 있지만, 태그 테이블에 존재하는 태그");
        if(tag) {
            db.sequelize.models.todo_tag.create({
                ToDoId: todoId,
                TagId: tag.id
            })
        }

        // 할 일 수정날짜 변경
        todo = await Todo.update({
            updated_at: Sequelize.fn('NOW'),
        }, {
            where: {id: todoId},
        });
        todo = await Todo.findOne({
            attributes: ['id', 'todo_name'],
            include: {
                attributes: ['id', 'tag_name', 'font_color', 'bg_color'],
                model: Tag,
                through: {attributes: []} // 연결 테이블에서 가져올 컬럼
            },
            where: {id: todoId }
        }); 

        // console.log("~~todo", todo);

        res.status(200).json(
            {
                updated_at: todo.updated_at,
                todo: todo,
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
