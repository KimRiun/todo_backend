// 특정 할 일에 등록된 태그 삭제
const Sequelize = require('sequelize');
const Todo = require('./../../../models/todo');
const Tag = require('./../../../models/tag');
const db = require('./../../../models');


module.exports = async (req, res) => {
    const {todoId} = req.params; // todo id
    const {tag_name} = req.query; // 삭제할 태그명


    // 특정 할 일에 등록된 태그 삭제
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



        // 태그 id 찾기
        const tag = await Tag.findOne({
            where: {tag_name : tag_name }
        })
    
        // 존재하지 않는 태그일 경우
        if (!tag) {
            return res.status(400).json(
            {
                message: "존재하지 않는 태그입니다",
            });
        }

        // 할일에 등록되어 있지 않은 태그일 경우
        const tag_in_todo = await db.sequelize.models.todo_tag.findOne({
            where: {
                [Sequelize.Op.and]: [{ TagId: tag.id }, { ToDoId: todoId }]
            }
        }); 

        if (!tag_in_todo) {
            return res.status(400).json(
            {
                message: "해당 할 일에 등록되어 있지 않은 태그입니다",
            });
        }



        // 할일과 태그의 연결 끊기
        // 할일-태그 테이블에서 삭제
        await db.sequelize.models.todo_tag.destroy({
            where: {
                [Sequelize.Op.and]: [{ TagId: tag.id }, { ToDoId: todoId }]
            }
        }); 
        
        // 할 일 수정날짜 변경
        await Todo.update({
            updated_at: Sequelize.fn('NOW'),
        }, {
            where: {id: todoId},
        });
        const todo = await Todo.findOne({
            attributes : ['updated_at'],
            where: {id: todoId},
        });

        // 삭제한 뒤 남은 태그들
        const todo_tag = await Todo.findOne({
            attributes: [],
            include: {
                attributes: ['tag_name', 'font_color', 'bg_color'],
                model: Tag,
                through: {attributes: []} // 연결 테이블에서 가져올 컬럼
            },
            where: {
                id: todoId,
            }
        }); 
        

        // 삭제한 뒤 남은 태그들 response
        res.status(200).json(
            {
                updated_at: todo.updated_at,
                todo_tag: todo_tag,
                message: "특정 할 일에 등록된 태그 삭제 성공",
            }
        );
    }
    catch(err) {
        res.status(400).json(
            {
                message: "특정 할 일에 등록된 태그 실패",
            }
        );
        console.error("특정 할 일에 등록된 태그 실패", err);
    }



};