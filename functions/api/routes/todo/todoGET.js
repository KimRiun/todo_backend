// 모든 할 일 조회
const Todo = require('./../../../models/todo');
const Tag = require('./../../../models/tag');



module.exports = async (req, res) => {
    // const {tags, sort} = req.query;
    // console.log("~~~~~~~~~~~~~~~~~~request query: tag, sort");
    // console.log(tags);
    // console.log(sort);

    // 태그 포함 전체 할 일 조회
    try {
        const todos = await Todo.findAll({
            order: [['created_at', "ASC"]], // 최신순 정렬
            include: {
                model: Tag,
                required: false, // 등록된 태그가 없어도 할일이 보이도록
                through: {attributes: []} // 연결 테이블에서 가져올 컬럼
            },
            where: {
                is_deleted: false, // 일반 삭제 검사
            }
        }); 
        res.status(200).json(
            {
                todos: todos,
                message: "할일 조회 성공",
            }
        );
    }
    catch(err) {
        res.status(400).json(
            {
                message: "할일 조회 실패",
            }
        );
        console.error("할일 조회 실패", err);
    }



};