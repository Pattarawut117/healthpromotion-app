export type MentalAssessment = {
    id: number;
    question: string;
    type: string;
}

export const mentalAssessment: MentalAssessment[] = [
    { id: 1, question: "ข้าพเข้ารู้สึกว่ายากที่จะผ่อนคลายอารมณ์", type: "anxiety" },
    { id: 2, question: "ข้าพเจ้าทราบว่าข้าพเจ้าปากแห้ง", type: "anxiety" },
    { id: 3, question: "ข้าพเจ้าไม่รู้สึกไม่ดีขึ้นเลย", type: "anxiety" },
    { id: 4, question: "ข้าพเจ้ามีอาการหายใจลำบาก", type: "anxiety" },
    { id: 5, question: "ข้าพเจ้ารู้สึกทำกิจกรรมด้วยตนเองได้ค่อนข้างลำบาก", type: "anxiety" },
    { id: 6, question: "ข้าพเจ้ามีปฏิกริริยาตอบสนองสิ่งต่างๆมากเกินไป", type: "anxiety" },
    { id: 7, question: "ข้าพเจ้ามีอาการสั่น (เช่น ที่มือทั้งสองข้าง)", type: "anxiety" },
    { id: 8, question: "ข้าพเจ้ารู้สึกว่าข้าพเจ้าวิตกกังวลมาก", type: "depress" },
    { id: 9, question: "ข้าพเจ้ารู้สึกกังวลกับเหตุการณ์ที่อาจทำให้ข้าพเจ้ารู้สึกตื่นกลัวและกระทำในสิ่งใดโดยมิได้คิด", type: "depress" },
    { id: 10, question: "ข้าพเจ้ารู้สึกว่าข้าพเจ้าไม่มีเป้าหมาย", type: "depress" },
    { id: 11, question: "ข้าพเจ้ารู้สึกว่าข้าพเจ้ามีอาการกระวนกระวายใจ", type: "depress" },
    { id: 12, question: "ข้าพเจ้ารู้สึกว่าไม่ผ่อนคลาย", type: "depress" },
    { id: 13, question: "ข้าพเจ้ารู้สึกจิตใจเหงาหงอยและซึมเศร้า", type: "depress" },
    { id: 14, question: "ข้าพเจ้าทนไม่ได้กับภาวะใดก็ตามที่ทำให้ข้าพเจ้าไม่สามารถทำอะไรต่อจากที่ข้าพเจ้ากำลังทำอยู่", type: "depress" },
    { id: 15, question: "รู้สึกว่าข้าพเจ้ามีอาการคล้ายกับอาการหวั่นวิตก", type: "stress" },
    { id: 16, question: "ไม่รู้สึกกระตือรือร้นต่อสิ่งใด", type: "stress" },
    { id: 17, question: "รู้สึกเป็นคนไม่มีคุณค่า", type: "stress" },
    { id: 18, question: "รู้สึกว่าข้าพเจ้าค่อนข้างมีอารมณ์ฉุนเฉียวง่าย", type: "stress" },
    { id: 19, question: "ข้าพเจ้ารับรู้ถึงการทำงานของหัวใจในตอนที่ไม่ได้ออกแรง", type: "stress" },
    { id: 20, question: "รู้สึกกลัวโดยไม่มีเหตุผลใดๆ", type: "stress" },
    { id: 21, question: "รู้สึกว่าชีวิตไม่มีความหมาย", type: "stress" },
];
