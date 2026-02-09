from flask import Blueprint, request, jsonify
import subprocess
import platform

admin_bp = Blueprint('admin', __name__)

# Assume admin check middleware is applied here in real app
# For this demo, we'll just leave it open or assume the attacker has found a way

@admin_bp.route('/system-check', methods=['POST'])
def system_check():
    data = request.get_json()
    host = data.get('host', 'localhost')
    
    # VULNERABILITY: Command Injection
    # "Ping" utility for admin to check server connectivity
    param = '-n' if platform.system().lower() == 'windows' else '-c'
    command = f"ping {param} 1 {host}"
    
    try:
        # shell=True is the key here
        output = subprocess.check_output(command, shell=True, stderr=subprocess.STDOUT)
        return jsonify({'output': output.decode('utf-8')})
    except subprocess.CalledProcessError as e:
        return jsonify({'output': e.output.decode('utf-8')}), 500
