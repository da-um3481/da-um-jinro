#!/bin/bash
# 백업 스크립트 - 현재 작동하는 버전 백업

echo "🔒 학생 포털 백업 시작..."

# 백업 디렉토리 생성
BACKUP_DIR="/home/user/webapp/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_PATH="$BACKUP_DIR/backup_$TIMESTAMP"

mkdir -p "$BACKUP_PATH"

# 주요 파일 백업
echo "📦 파일 복사 중..."
cp geunhwa-student-portal.html "$BACKUP_PATH/"
cp geunhwa-student-portal-semester.html "$BACKUP_PATH/"
cp *.md "$BACKUP_PATH/" 2>/dev/null || true

# 백업 정보 저장
echo "Backup created at: $(date)" > "$BACKUP_PATH/backup_info.txt"
echo "Git commit: $(git rev-parse HEAD)" >> "$BACKUP_PATH/backup_info.txt"
echo "Git branch: $(git branch --show-current)" >> "$BACKUP_PATH/backup_info.txt"

echo "✅ 백업 완료: $BACKUP_PATH"
echo ""
echo "백업 위치:"
ls -lh "$BACKUP_PATH"
echo ""
echo "💡 복원 방법:"
echo "   cp $BACKUP_PATH/geunhwa-student-portal.html /home/user/webapp/"
