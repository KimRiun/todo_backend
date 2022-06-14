// 할 일 삭제
const Sequelize = require('sequelize');
const Todo = require('./../../../models/todo');
const Tag = require('./../../../models/tag');
const db = require('./../../../models');


module.exports = async (req, res) => {
    const {todoId} = req.params; // todo id
    const {hard} = req.query; // 완전삭제


    // 할 일 삭제
    try {
        console.log("~~~~~~~~~~~~hard:", hard, ',', typeof(hard));

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
        


        // 완전 삭제
        if (hard === "true"){
            console.log("완전삭제")
            // 할일-태그 테이블에서 해당 할일 모두 삭제
            await db.sequelize.models.todo_tag.destroy({
                where: {ToDoId: todoId }
            })

            // 할일 테이블에서 row도 삭제
            await Todo.destroy({
                where: {id: todoId }
            })

            res.status(200).json(
                {
                    message: "할일 완전 삭제 성공",
                }
            );

        }
        // 일반 삭제
        else{

            // 이미 일반 삭제된 할 일인지 검사
            if(valid.is_deleted === true) {
                return res.status(400).json(
                {
                    message: "이미 일반 삭제된 할 일 입니다",
                });
            }


            console.log("일반삭제")
            // is_deleted 만 true로
            await Todo.update({
                is_deleted: true,
                }, {
                where: {id: todoId }
            });

            res.status(200).json(
                {
                    message: "할일 일반 삭제 성공",
                }
            );
        }
        
        

    }
    catch(err) {
        res.status(400).json(
            {
                message: "할일 삭제 실패",
            }
        );
        console.error("할일 삭제 실패", err);
    }



};
