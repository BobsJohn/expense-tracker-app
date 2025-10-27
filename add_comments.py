#!/usr/bin/env python3
"""
批量为项目文件添加中文注释的辅助脚本

功能：
- 扫描指定目录下的所有 TypeScript/TSX 文件
- 为每个文件添加文件头注释
- 识别导出的函数、类、接口并添加 JSDoc 注释
"""

import os
import re
from pathlib import Path

def get_file_purpose(file_path):
    """根据文件路径推断文件用途"""
    path_parts = file_path.split('/')
    
    if 'components' in path_parts:
        if 'common' in path_parts:
            return '通用组件'
        elif 'shared' in path_parts:
            return '共享组件'
        elif 'ui' in path_parts:
            return 'UI 基础组件'
        elif 'charts' in path_parts:
            return '图表组件'
        else:
            return 'React 组件'
    elif 'screens' in path_parts:
        return '页面组件'
    elif 'hooks' in path_parts:
        return '自定义 Hook'
    elif 'utils' in path_parts:
        return '工具函数'
    elif 'services' in path_parts:
        return '服务层'
    elif 'store' in path_parts:
        if 'slices' in path_parts:
            return 'Redux Slice'
        elif 'thunks' in path_parts:
            return 'Redux Thunk'
        elif 'actions' in path_parts:
            return 'Redux Action'
        else:
            return 'Redux Store'
    elif 'repositories' in path_parts:
        return '数据访问层'
    elif 'database' in path_parts:
        return '数据库管理'
    elif 'types' in path_parts:
        return '类型定义'
    elif 'theme' in path_parts:
        return '主题配置'
    elif 'navigation' in path_parts:
        return '导航配置'
    elif 'localization' in path_parts:
        return '国际化配置'
    else:
        return '模块'

def list_files_needing_comments():
    """列出所有需要添加注释的文件"""
    src_dir = Path('/home/engine/project/src')
    files = []
    
    for ext in ['*.ts', '*.tsx']:
        for file_path in src_dir.rglob(ext):
            # 排除测试文件和类型声明文件
            if '__tests__' not in str(file_path) and not str(file_path).endswith('.d.ts'):
                files.append(file_path)
    
    return sorted(files)

if __name__ == '__main__':
    files = list_files_needing_comments()
    print(f"需要添加注释的文件总数: {len(files)}")
    print("\n文件列表：")
    for i, f in enumerate(files, 1):
        rel_path = f.relative_to('/home/engine/project')
        purpose = get_file_purpose(str(f))
        print(f"{i}. {rel_path} - {purpose}")
