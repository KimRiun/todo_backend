# todo_backend

## 할일 생성하고 태그를 달 수 있는 프로그램
1. 할일을 생성할 수 있다.
2. 할일을 삭제할 수 있다. 삭제는 soft, hard 둘다 지원한다.
3. 할일에 설명을 달 수 있다.
4. 할일에 여러 태그를 달 수 있다.
5. 특정 할일을 조회하고, 그 할일의 특정 태그를 삭제할 수 있다.
6. 태그별로 할일을 조회할 수 있다.
7. 태그별로 배경색, 글자색을 가지고 있다.
8. 할일 완료여부를 체크할 수 있다.



- API table

https://poised-mandible-7e9.notion.site/0b405df2532e4c7a8bdc85d1f10b74cb?v=bbc79126362745f59a34e1734aae04bc


- PostgreSQL

이유: 

sql vs Nosql → 테이블에 컬럼, 데이터 같은게 정형화 되어 있으므로 sql을 사용한다. Nosql 예를 들어 몽고디비 같은거는 정형화 되지 않은 데이터가 들어가므로 적절하지 않다.

sql 중 MySql VS PosotgreSQL : MySql은 읽기 작업이 많을 때 용이하다. 하지만 todo에서는 쓰기 작업도 많으므로 MySQL보다 PostgreSQL을 사용한다.

     

- 태그
    - 생성일 : 사용자 눈에는 안보이고 DB에만 저장

